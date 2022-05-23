import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import fetch from 'node-fetch';
import HLS from 'hls-parser';
import { initLogger } from '@twitch-archiving/utils';
import { initRedis, getPlaylistMessage, setPlaylistEnding, getRecordingId, } from '@twitch-archiving/database';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-playlist' },
    outputTopic: { type: String, defaultValue: 'tw-playlist-segment' },
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
await initRedis(config, config.redisPrefix);
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
        const playlist = await getPlaylistMessage(user);
        if (playlist === undefined)
            return;
        const resp = await fetch(playlist.url);
        const data = await resp.text();
        if (resp.status !== 200)
            return;
        logger.trace({ data }, 'playlist text');
        const list = HLS.parse(data);
        if (list.endlist) {
            const recordingId = await getRecordingId(user);
            await setPlaylistEnding(recordingId);
        }
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
                timestamp: new Date().getTime().toString(),
            });
        }
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
