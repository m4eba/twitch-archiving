import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import fetch from 'node-fetch';
import HLS from 'hls-parser';
import { createClient } from 'redis';
import { initLogger } from '@twitch-archiving/utils';
const PlaylistConfigOpt = {
    inputTopic: { type: String, multiple: true },
    outputTopic: { type: String, multiple: true },
    redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PlaylistConfigOpt,
    ...RedisConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('playlist-update');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
const redis = createClient({
    url: config.redisUrl,
});
await redis.connect();
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'playlist-update' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        const user = message.key.toString();
        const playlistData = await redis.get(config.redisPrefix + user);
        if (playlistData === null)
            return;
        const playlist = JSON.parse(playlistData);
        if (playlist === null)
            return;
        const resp = await fetch(playlist.url);
        const data = await resp.text();
        const list = HLS.parse(data);
        for (let i = 0; i < list.segments.length; ++i) {
            const seg = list.segments[i];
            let time = '';
            if (seg.programDateTime) {
                time = seg.programDateTime.toISOString();
            }
            else {
                time = new Date().toISOString();
            }
            const msg = {
                user,
                id: playlist.id,
                type: playlist.type,
                sequenceNumber: seg.mediaSequenceNumber,
                duration: seg.duration,
                time,
                url: seg.uri,
            };
            await sendData(config.outputTopic, {
                key: user,
                value: JSON.stringify(msg),
                timestamp: new Date().toString(),
            });
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
