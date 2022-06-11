import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import fetch from 'node-fetch';
import HLS from 'hls-parser';
import { initLogger } from '@twitch-archiving/utils';
import { initRedis, download as dl } from '@twitch-archiving/database';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-playlist' },
    segmentOutputTopic: { type: String, defaultValue: 'tw-playlist-segment' },
    recordingOutputTopic: { type: String, defaultValue: 'tw-recording-ended' },
    playlistReloadOutputTopic: { type: String, defaultValue: 'tw-live' },
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
        const playlist = await dl.getPlaylistMessage(user);
        logger.debug({ playlist, user }, 'playlist');
        if (playlist === undefined) {
            await forcePlaylistUpdate(user);
            return;
        }
        const resp = await fetch(playlist.url);
        const data = await resp.text();
        if (resp.status !== 200) {
            await dl.incPlaylistError(playlist.recordingId);
            await forcePlaylistUpdate(user);
            await dl.isRecordingDone(playlist.recordingId);
            return;
        }
        logger.trace({ data }, 'playlist text');
        const list = HLS.parse(data);
        if (list.endlist) {
            await dl.setPlaylistEnding(playlist.recordingId);
        }
        for (let i = 0; i < list.segments.length; ++i) {
            const seg = list.segments[i];
            if (await dl.testSegment(playlist.recordingId, seg.mediaSequenceNumber))
                continue;
            await dl.addSegment(playlist.recordingId, seg.mediaSequenceNumber);
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
                recordingId: playlist.recordingId,
                type: playlist.type,
                sequenceNumber: seg.mediaSequenceNumber,
                duration: seg.duration,
                time,
                url: seg.uri,
            };
            await sendData(config.segmentOutputTopic, {
                key: user,
                value: JSON.stringify(msg),
                timestamp: new Date().getTime().toString(),
            });
        }
        await isRecordingDone(playlist);
    },
});
async function isRecordingDone(playlist) {
    // test if all segments are done
    // this playlist update could have no new segments in it
    // only the end meta
    if (await dl.isRecordingDone(playlist.recordingId)) {
        logger.debug({ recordingId: playlist.recordingId }, 'end recording');
        await dl.stopRecording(new Date(), playlist.recordingId);
        const msg = {
            user: playlist.user,
            id: playlist.id,
            recordingId: playlist.recordingId,
        };
        await sendData(config.recordingOutputTopic, {
            key: playlist.user,
            value: JSON.stringify(msg),
            timestamp: new Date().getTime().toString(),
        });
    }
}
async function forcePlaylistUpdate(user) {
    await sendData(config.playlistReloadOutputTopic, {
        key: user,
        value: JSON.stringify({
            forceReload: true,
        }),
        timestamp: new Date().getTime().toString(),
    });
}
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
