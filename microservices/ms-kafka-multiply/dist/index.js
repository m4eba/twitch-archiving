import { KafkaConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import pino from 'pino';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
const MultiConfigOpt = {
    inputTopic: { type: String },
    outputTopic: { type: String, multiple: true },
};
const config = parse({
    ...KafkaConfigOpt,
    ...MultiConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = pino({ level: 'debug' }).child({
    module: 'kafka-multi',
});
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'websocket-dump' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
// TODO use eachBatch instead
await consumer.run({
    eachMessage: async ({ message }) => {
        const messages = [];
        for (let i = 0; i < config.outputTopic.length; ++i) {
            const topicMessage = {
                topic: config.outputTopic[i],
                messages: [message],
            };
            messages.push(topicMessage);
        }
        await producer.sendBatch({ topicMessages: messages });
    },
});
