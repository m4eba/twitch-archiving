import fs from 'fs';
import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import path from 'path';
import { downloadSegment, initLogger } from '@twitch-archiving/utils';
import { createClient } from 'redis';
import { PlaylistType, } from '@twitch-archiving/messages';
import { getFile, initPostgres, initRedis, startFile, updateFileDownloadSize, updateFileSize, updateFileStatus, incrementFileRetries, finishedFile, } from '@twitch-archiving/database';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-playlist-segment' },
    segmentOutputTopic: { type: String, defaultValue: 'tw-segment-ended' },
    recordingOutputTopic: { type: String, defaultValue: 'tw-recording-ended' },
    outputPath: { type: String },
    maxFileRetries: { type: Number, defaultValue: 3 },
    redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
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
const redis = createClient({
    url: config.redisUrl,
});
await initPostgres(config);
await initRedis(config, config.redisPrefix);
await redis.connect();
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'segment-download' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    eachMessage: async ({ message, heartbeat }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const seg = JSON.parse(message.value.toString());
        logger.trace({ seg }, 'segment download');
        const filename = seg.sequenceNumber.toString().padStart(5, '0') + '.ts';
        const recordingId = seg.recordingId;
        if (recordingId.length === 0) {
            logger.error({ seg }, 'recordingId not found');
            return;
        }
        const file = await getFile(recordingId, filename);
        if (file !== undefined) {
            if (file.status === 'error' && file.retries < config.maxFileRetries) {
                logger.debug({ recordingId, filename }, 'retry');
                await incrementFileRetries(recordingId, filename);
            }
            else {
                logger.debug({ recordingId, filename, status: file.status }, 'stop download');
                return;
            }
        }
        const type = seg.type === PlaylistType.LIVE ? 'stream' : 'vod';
        const dir = path.join(config.outputPath, seg.user, type, seg.id);
        await fs.promises.mkdir(dir, { recursive: true });
        const name = path.join(dir, filename);
        await startFile(recordingId, filename, seg.sequenceNumber, seg.duration, new Date(seg.time));
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
                    await updateFileSize(recordingId, filename, totalSize);
                },
            });
            logger.debug({ name, downloadSize }, 'filesize');
            await updateFileDownloadSize(recordingId, filename, downloadSize);
            await updateFileStatus(recordingId, filename, 'done');
            const msg = {
                user: seg.user,
                id: seg.id,
                recordingId,
                sequenceNumber: seg.sequenceNumber,
                duration: seg.duration,
                filename,
                path: name,
            };
            await sendData(config.segmentOutputTopic, {
                key: seg.user,
                value: JSON.stringify(msg),
                timestamp: new Date().getTime().toString(),
            });
        }
        catch (e) {
            logger.debug('unable to download segement', { seg });
            await updateFileStatus(recordingId, filename, 'error');
        }
        if (await finishedFile(recordingId, seg.sequenceNumber)) {
            const msg = {
                user: seg.user,
                id: seg.id,
                recordingId: seg.recordingId,
            };
            await sendData(config.recordingOutputTopic, {
                key: seg.user,
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
