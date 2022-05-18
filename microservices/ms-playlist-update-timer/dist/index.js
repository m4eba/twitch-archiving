import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { createClient } from 'redis';
import { initLogger } from '@twitch-archiving/utils';
const PlaylistUpdateTimerConfigOpt = {
    interval: { type: Number, defaultValue: 2000 },
    outputTopic: { type: String, defaultValue: 'tw-playlist' },
    redisSetName: { type: String, defaultValue: 'tw-playlist-live' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PlaylistUpdateTimerConfigOpt,
    ...RedisConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('playlist-update-time');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
const redis = createClient({
    url: config.redisUrl,
});
await redis.connect();
const producer = kafka.producer();
await producer.connect();
setInterval(async () => {
    const channels = await redis.sMembers(config.redisSetName);
    const messages = [];
    for (let i = 0; i < channels.length; ++i) {
        messages.push({
            key: channels[i],
            value: null,
            timestamp: new Date().toString(),
        });
    }
    await sendData(config.outputTopic, messages);
}, config.interval);
async function sendData(topic, msg) {
    const messages = [];
    const topicMessage = {
        topic,
        messages: msg,
    };
    messages.push(topicMessage);
    logger.debug({ topic: topic, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
}
