import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, PostgresConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import HLS from 'hls-parser';
import { RecordingMessageType, } from '@twitch-archiving/messages';
import { initLogger, fetchWithTimeoutText } from '@twitch-archiving/utils';
import { initRedis, download as dl, initPostgres, } from '@twitch-archiving/database';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-playlist-request' },
    recordingOutputTopic: { type: String, defaultValue: 'tw-recording' },
    playlistReloadOutputTopic: { type: String, defaultValue: 'tw-live' },
    redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
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
await initPostgres(config);
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
        const recording = await dl.getRunningRecording(user);
        if (recording === undefined) {
            await forcePlaylistUpdate(user);
            return;
        }
        const playlist = recording.data;
        logger.debug({ playlist, user }, 'playlist');
        if (playlist === null) {
            await forcePlaylistUpdate(user);
            return;
        }
        logger.trace({ url: playlist.bestUrl, user }, 'fetch playlist');
        //const resp = await fetch(playlist.url);
        const { data, resp } = await fetchWithTimeoutText(playlist.bestUrl, 3, 2000);
        if (resp.status !== 200) {
            logger.debug({ code: resp.status }, 'invalid status code');
            await forcePlaylistUpdate(user);
            return;
        }
        logger.trace({ data }, 'playlist text');
        const list = HLS.parse(data);
        const latestFile = await dl.getLatestFile(recording.id);
        let offset = 0;
        if (latestFile !== undefined) {
            offset = latestFile.time_offset + latestFile.duration;
        }
        for (let i = 0; i < list.segments.length; ++i) {
            const seg = list.segments[i];
            if (latestFile !== undefined &&
                seg.mediaSequenceNumber <= latestFile.seq) {
                continue;
            }
            let time;
            if (seg.programDateTime) {
                time = seg.programDateTime;
            }
            else {
                time = new Date();
            }
            const filename = seg.mediaSequenceNumber.toString().padStart(5, '0') + '.ts';
            await dl.addFile(recording.id, filename, seg.mediaSequenceNumber, offset, seg.duration, time);
            const msg = {
                type: RecordingMessageType.SEGMENT,
                user,
                id: recording.site_id,
                recordingId: recording.id,
                playlistType: playlist.type,
                sequenceNumber: seg.mediaSequenceNumber,
                offset: offset,
                duration: seg.duration,
                time: time.toISOString(),
                url: seg.uri,
            };
            offset += seg.duration;
            await sendData(config.recordingOutputTopic, {
                key: user,
                value: JSON.stringify(msg),
                timestamp: new Date().getTime().toString(),
            });
        }
        if (list.endlist) {
            await dl.stopRecording(new Date(), recording.id);
            const msg = {
                type: RecordingMessageType.ENDED,
                user,
                id: recording.site_id,
                recordingId: recording.id,
                playlistType: playlist.type,
                segmentCount: await dl.getFileCount(recording.id),
            };
            await sendData(config.recordingOutputTopic, {
                key: user,
                value: JSON.stringify(msg),
                timestamp: new Date().getTime().toString(),
            });
        }
    },
});
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
