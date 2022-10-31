import fs from 'fs';
import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import path from 'path';
import { downloadSegment, initLogger } from '@twitch-archiving/utils';
import { PlaylistMessageType, PlaylistType, RecordingMessageType, SegmentDownloadedStatus, } from '@twitch-archiving/messages';
import { initPostgres, download as dl } from '@twitch-archiving/database';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-recording' },
    playlistOutputTopic: { type: String, defaultValue: 'tw-playlist' },
    outputPath: { type: String },
    maxFileRetries: { type: Number, defaultValue: 3 },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PlaylistConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('segment-download');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initPostgres(config);
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'segment-download' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    partitionsConsumedConcurrently: 3,
    eachMessage: async ({ message, heartbeat }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const seg = JSON.parse(message.value.toString());
        logger.trace({ seg }, 'segment download');
        if (seg.type !== RecordingMessageType.SEGMENT) {
            return;
        }
        const filename = seg.sequenceNumber.toString().padStart(5, '0') + '.ts';
        const recordingId = seg.recordingId;
        if (recordingId.length === 0) {
            logger.error({ seg }, 'recordingId not found');
            return;
        }
        const file = await dl.getFile(recordingId, filename);
        if (file === undefined) {
            logger.error({ seg }, 'file not in database');
            return;
        }
        const type = seg.playlistType === PlaylistType.LIVE ? 'stream' : 'vod';
        const dir = path.join(config.outputPath, seg.user, type, seg.id);
        await fs.promises.mkdir(dir, { recursive: true });
        const name = path.join(dir, filename);
        await dl.updateFileStatus(recordingId, filename, 'downloading');
        let status = SegmentDownloadedStatus.DONE;
        try {
            let downloadSize = 0;
            logger.debug({ name }, 'download');
            await downloadSegment(seg, name, {
                updateProgress: async (_, __, size) => {
                    downloadSize = size;
                    heartbeat().catch(() => { });
                },
                updateFilesize: async (_, filename, __, totalSize) => {
                    logger.debug({ recordingId, filename, totalSize }, 'update file size');
                    await dl.updateFileSize(recordingId, filename, totalSize);
                },
            });
            logger.debug({ name, downloadSize }, 'filesize');
            await dl.updateFileDownloadSize(recordingId, filename, downloadSize);
            await dl.updateFileStatus(recordingId, filename, 'done');
            status = SegmentDownloadedStatus.DONE;
        }
        catch (e) {
            logger.debug({ seg, error: e }, 'unable to download segement');
            await dl.incrementFileRetries(recordingId, filename);
            status = SegmentDownloadedStatus.ERROR;
            if (file.retries > config.maxFileRetries) {
                await dl.updateFileStatus(recordingId, filename, 'error');
                logger.debug({ recordingId, filename }, 'max retries');
            }
            else {
                await dl.updateFileStatus(recordingId, filename, 'waiting');
                throw new Error('unable to download' + filename);
            }
        }
        const msg = {
            type: PlaylistMessageType.DOWNLOAD,
            user: seg.user,
            id: seg.id,
            recordingId,
            sequenceNumber: seg.sequenceNumber,
            offset: seg.offset,
            duration: seg.duration,
            filename,
            path: name,
            status,
        };
        await sendData(config.playlistOutputTopic, {
            key: seg.user + '-' + seg.recordingId,
            value: JSON.stringify(msg),
            timestamp: new Date().getTime().toString(),
        });
        const done = await dl.allFilesDone(recordingId);
        if (done) {
            const plMsg = {
                type: PlaylistMessageType.END,
                user: seg.user,
                id: seg.id,
                recordingId,
            };
            logger.trace({ msg: plMsg }, 'playlist done');
            await sendData(config.playlistOutputTopic, {
                key: seg.user + '-' + seg.recordingId,
                value: JSON.stringify(plMsg),
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
