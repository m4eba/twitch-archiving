import fs from 'fs';
import { KafkaConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import path from 'path';
import im from 'imagemagick';
import util from 'util';
import { initLogger } from '@twitch-archiving/utils';
const convert = util.promisify(im.convert);
const ScreenshotConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-screenshot' },
    outputTopic: { type: String, defaultValue: 'tw-screenshot-minimized' },
    screenshotFolder: { type: String },
    width: { type: Number },
    deleteSource: { type: Boolean, defaultValue: true },
};
const config = parse({
    ...KafkaConfigOpt,
    ...ScreenshotConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('screenshot-minimize');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({
    groupId: 'screenshot-minimize',
});
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    partitionsConsumedConcurrently: 3,
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        logger.debug({ msg }, 'screenhostDoneMessage');
        const output = path.join(config.screenshotFolder, msg.recordingId);
        await fs.promises.mkdir(output, { recursive: true });
        await convert([
            path.join(msg.path, msg.filename),
            '-resize',
            config.width.toString(),
            path.join(output, msg.filename),
        ]);
        if (config.deleteSource) {
            await fs.promises.rm(path.join(msg.path, msg.filename));
        }
        const outMsg = {
            recordingId: msg.recordingId,
            index: msg.index,
            filename: msg.filename,
            path: output,
        };
        await sendData(config.outputTopic, {
            key: message.key,
            value: JSON.stringify(outMsg),
            timestamp: new Date().getTime().toString(),
        });
    },
});
async function sendData(topic, msg) {
    const messages = [];
    const topicMessage = {
        topic,
        messages: [msg],
    };
    messages.push(topicMessage);
    logger.debug({ topic: topic, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
}
