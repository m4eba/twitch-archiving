import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { initLogger } from '@twitch-archiving/utils';
import { initRedis, getRecordedChannels } from '@twitch-archiving/database';
const PlaylistUpdateTimerConfigOpt = {
    interval: { type: Number, defaultValue: 2000 },
    outputTopic: { type: String, defaultValue: 'tw-playlist' },
    redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
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
await initRedis(config, config.redisPrefix);
const producer = kafka.producer();
await producer.connect();
setInterval(async () => {
    const channels = await getRecordedChannels();
    const messages = [];
    for (let i = 0; i < channels.length; ++i) {
        messages.push({
            key: channels[i],
            value: null,
            timestamp: new Date().getTime().toString(),
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
