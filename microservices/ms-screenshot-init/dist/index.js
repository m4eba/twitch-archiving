import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { initLogger } from '@twitch-archiving/utils';
import { initRedis, getRedis, screenshot as sb, } from '@twitch-archiving/database';
const PlaylistConfigOpt = {
    recordingInputTopic: { type: String, defaultValue: 'tw-recording' },
    recordingEndedInputTopic: {
        type: String,
        defaultValue: 'tw-recording-ended',
    },
    segmentsInputTopic: { type: String, defaultValue: 'tw-playlist-segment' },
    outputTopic: { type: String, defaultValue: 'tw-screenshot' },
    user: { type: String, multiple: true },
    interval: { type: Number, defaultValue: 10.0 },
    redisPrefix: { type: String, defaultValue: 'tw-screenshot-' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PlaylistConfigOpt,
    ...RedisConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('screenshot-init');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initRedis(config, config.redisPrefix);
const redis = getRedis();
if (!redis) {
    throw new Error('unable to initizlize redis');
}
const userSet = new Set();
config.user.forEach((u) => userSet.add(u));
// get notified of new recordings
const consumerRecording = kafka.consumer({
    groupId: 'screenshot-init-recording-start',
});
await consumerRecording.connect();
await consumerRecording.subscribe({
    topic: config.recordingInputTopic,
    fromBeginning: true,
});
await consumerRecording.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        if (!userSet.has(msg.user))
            return;
        await sb.markStarted(msg.recordingId);
    },
});
// mark segments for screenshots
const consumerSegments = kafka.consumer({
    groupId: 'screenshot-init-segments',
});
await consumerSegments.connect();
await consumerSegments.subscribe({
    topic: config.segmentsInputTopic,
    fromBeginning: true,
});
const producer = kafka.producer();
await producer.connect();
await consumerSegments.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        logger.trace({ user: message.key, msg }, 'playlistSegmentMessage');
        if (!userSet.has(msg.user))
            return;
        const started = await sb.hasStarted(msg.recordingId);
        let data = {
            sequence: msg.sequenceNumber,
            index: 0,
            offset: 0.0,
        };
        if (started) {
            logger.debug({ msg, started }, 'recording started');
            const ss = {
                sequence: data.sequence,
                index: data.index,
                offset: data.offset,
            };
            await sb.setRequest(msg.recordingId, ss);
            data.index++;
            await sb.unmarkStarted(msg.recordingId);
            await sb.setData(msg.recordingId, data);
        }
        else {
            const result = await sb.getData(msg.recordingId);
            if (result === undefined) {
                return;
            }
            logger.debug({ msg, data: result }, 'recording running');
            data = result;
            data.sequence = msg.sequenceNumber;
        }
        if (data.offset + msg.duration >= config.interval) {
            data.offset = data.offset + msg.duration - config.interval;
            const ss = {
                sequence: data.sequence,
                index: data.index,
                offset: data.offset,
            };
            await sb.setRequest(msg.recordingId, ss);
            data.index++;
        }
        else {
            data.offset = data.offset + msg.duration;
        }
        logger.trace({ msg, data }, 'modified data');
        await sb.setData(msg.recordingId, data);
    },
});
// clean up after recording is done
const consumerRecordingEnded = kafka.consumer({
    groupId: 'screenshot-init-recording-end',
});
await consumerRecordingEnded.connect();
await consumerRecordingEnded.subscribe({
    topic: config.recordingInputTopic,
    fromBeginning: true,
});
await consumerRecordingEnded.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        if (!userSet.has(msg.user))
            return;
        await sb.endRecording(msg.recordingId);
    },
});
