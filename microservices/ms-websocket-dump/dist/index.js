import { KafkaConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import path from 'path';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { FileWriter, initLogger } from '@twitch-archiving/utils';
const DumpConfigOpt = {
    topic: { type: String },
    path: { type: String },
};
const config = parse({
    ...KafkaConfigOpt,
    ...DumpConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('websocket-dump');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
logger.info({ topic: config.topic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'websocket-dump' });
await consumer.connect();
await consumer.subscribe({ topic: config.topic, fromBeginning: true });
const out = new Map();
await consumer.run({
    eachMessage: async ({ message }) => {
        if (message.value && message.key) {
            logger.info({
                message: JSON.parse(message.value.toString()),
            }, 'msg received');
            const key = message.key.toString();
            let o = out.get(key);
            if (o === undefined) {
                o = new FileWriter(path.join(config.path, key));
                out.set(key, o);
            }
            o.write(new Date(parseInt(message.timestamp)).toISOString(), message.value.toString());
        }
    },
});
