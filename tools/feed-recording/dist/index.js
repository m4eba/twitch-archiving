import path from 'path';
import { KafkaConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { initPostgres, closePostgres, download as dl, } from '@twitch-archiving/database';
import { parse } from 'ts-command-line-args';
import { PlaylistMessageType, SegmentDownloadedStatus, } from '@twitch-archiving/messages';
import { initLogger } from '@twitch-archiving/utils';
const FeedRecordingConfigOpt = {
    id: { type: String },
    outputTopic: { type: String, defaultValue: 'tw-playlist' },
    path: { type: String },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...FeedRecordingConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('feed-recording');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
const producer = kafka.producer();
await producer.connect();
await initPostgres(config);
const recording = await dl.getRecording(config.id);
logger.trace({ recording }, 'recording');
if (recording === undefined) {
    logger.error({ id: config.id }, 'recording not found');
    process.exit(-1);
}
const files = await dl.getAllFiles(config.id);
if (files === undefined) {
    logger.error({ id: config.id }, 'no files found');
    process.exit(-1);
}
logger.trace({ size: files.length }, 'number of files');
for (let i = 0; i < files.length; ++i) {
    const f = files[i];
    const msg = {
        type: PlaylistMessageType.DOWNLOAD,
        user: recording.channel,
        id: recording.site_id,
        recordingId: recording.id,
        sequenceNumber: f.seq,
        offset: f.time_offset,
        duration: f.duration,
        filename: f.name,
        path: path.join(config.path, f.name),
        // TODO
        status: SegmentDownloadedStatus.DONE,
    };
    logger.trace({ msg }, 'SegmentDownloadMessage');
    await sendData(config.outputTopic, {
        key: recording.channel + '-' + recording.id,
        value: JSON.stringify(msg),
        timestamp: new Date().getTime().toString(),
    });
}
const plMsg = {
    type: PlaylistMessageType.END,
    user: recording.channel,
    id: recording.site_id,
    recordingId: recording.id,
};
logger.trace({ msg: plMsg }, 'playlist done');
await sendData(config.outputTopic, {
    key: recording.channel + '-' + recording.id,
    value: JSON.stringify(plMsg),
    timestamp: new Date().getTime().toString(),
});
await producer.disconnect();
await closePostgres();
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
