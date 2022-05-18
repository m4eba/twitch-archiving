import { KafkaConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import fs from 'fs';
import { initLogger } from '@twitch-archiving/utils';
const PubsubFilterConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-pubsub-events' },
    filterFile: { type: String },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PubsubFilterConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('pubsub-filter');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'pubsub-filter' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
const filter = JSON.parse(await fs.promises.readFile(config.filterFile, { encoding: 'utf8' }));
await consumer.run({
    eachMessage: async ({ message }) => {
        if (message.value) {
            const event = JSON.parse(message.value.toString());
            for (const key in filter) {
                if (event.topic.startsWith(key)) {
                    await sendData(filter[key], message);
                }
            }
        }
    },
});
async function sendData(topic, msg) {
    const messages = [];
    for (let i = 0; i < topic.length; ++i) {
        const topicMessage = {
            topic: topic[i],
            messages: [msg],
        };
        messages.push(topicMessage);
    }
    logger.debug({ topic: topic, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
}
