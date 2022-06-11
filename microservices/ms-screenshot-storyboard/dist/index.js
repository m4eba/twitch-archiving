import fs from 'fs';
import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import path from 'path';
import child_process from 'child_process';
import util from 'util';
import { initLogger } from '@twitch-archiving/utils';
import { initRedis, storyboard as sb } from '@twitch-archiving/database';
const exec = util.promisify(child_process.exec);
const StoryboardConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-screenshot-minimized' },
    outputTopic: { type: String, defaultValue: 'tw-storyboard-done' },
    storyboardFolder: { type: String },
    rows: { type: Number },
    columns: { type: Number },
    redisPrefix: { type: String, defaultValue: 'tw-screenshot-' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...StoryboardConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('screenshot-storyboard');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initRedis(config, config.redisPrefix);
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({
    groupId: 'screenshot-storyboard',
});
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        const output = path.join(config.storyboardFolder, msg.recordingId);
        await fs.promises.mkdir(output, { recursive: true });
        const filesPerBoard = config.rows * config.columns;
        const sbIndex = Math.floor(msg.index / filesPerBoard);
        logger.debug({ msg, filesPerBoard, sbIndex }, 'msg');
        // list with all screenshots that are ready for this montage
        const list = await sb.screenshotReady(msg.recordingId, sbIndex, msg);
        // order list by index
        const sorted = list.sort((a, b) => a.index - b.index);
        // build arument list
        const args = [];
        let idx = 0;
        logger.trace({ sorted }, 'sorted list');
        for (let i = sbIndex * filesPerBoard; i < (sbIndex + 1) * filesPerBoard; ++i) {
            logger.trace({ idx }, 'loop idx');
            if (idx == sorted.length)
                break;
            if (sorted[idx].index == i) {
                args.push('"' + path.join(sorted[idx].path, sorted[idx].filename) + '"');
                logger.trace({ item: sorted[idx] }, 'pushed item');
                ++idx;
            }
            else {
                args.push('null:');
            }
        }
        logger.trace({ msg, args }, 'montage file args');
        const filename = sbIndex.toString().padStart(5, '0') + '.png';
        await fs.promises.mkdir(output, { recursive: true });
        let command = 'montage ' + args.join(' ');
        command += ` -tile ${config.columns}x${config.rows}`;
        command += ' -geometry +0+0';
        command += ` ${path.join(output, filename)}`;
        logger.debug({ msg, command }, 'montage command');
        await exec(command);
        const outMsg = {
            recordingId: msg.recordingId,
            index: msg.index,
            offset: msg.offset,
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
