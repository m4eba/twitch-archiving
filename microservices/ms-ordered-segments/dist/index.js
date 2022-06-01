import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { initLogger } from '@twitch-archiving/utils';
import { initRedis, getRedis } from '@twitch-archiving/database';
const PlaylistConfigOpt = {
    recordingInputTopic: { type: String, defaultValue: 'tw-recording' },
    segmentsInputTopic: { type: String, defaultValue: 'tw-playlist-segment' },
    downloadedInputTopic: { type: String, defaultValue: 'tw-segment-ended' },
    outputTopic: { type: String, defaultValue: 'tw-segment-ended-ordered' },
    redisPrefix: { type: String, defaultValue: 'tw-ordered-segments-' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PlaylistConfigOpt,
    ...RedisConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('ordered-segments');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initRedis(config, config.redisPrefix);
const redis = getRedis();
if (!redis) {
    throw new Error('unable to initizlize redis');
}
// get notified of new recordings
const consumerRecording = kafka.consumer({
    groupId: 'ordered-segments',
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
        await redis.set(config.redisPrefix + 'started-' + msg.recordingId, 'true');
    },
});
// save sequencenumber of first playlist after recording started
const consumerSegments = kafka.consumer({
    groupId: 'ordered-segments',
});
await consumerSegments.connect();
await consumerSegments.subscribe({
    topic: config.segmentsInputTopic,
    fromBeginning: true,
});
await consumerSegments.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        const started = await redis.get(config.redisPrefix + 'started-' + msg.recordingId);
        if (started) {
            await redis.del(config.redisPrefix + 'started-' + msg.recordingId);
            await redis.set(config.redisPrefix + 'last-' + msg.recordingId, msg.sequenceNumber - 1);
        }
    },
});
const producer = kafka.producer();
await producer.connect();
const consumer = kafka.consumer({
    groupId: 'ordered-segments',
});
await consumer.connect();
await consumer.subscribe({
    topic: config.downloadedInputTopic,
    fromBeginning: true,
});
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        const lastStr = await redis.get(config.redisPrefix + 'last-' + msg.recordingId);
        let last = -1;
        if (lastStr !== null) {
            last = parseInt(lastStr);
        }
        if (msg.sequenceNumber === last + 1) {
            await sendData(config.outputTopic, {
                key: msg.user,
                value: JSON.stringify(msg),
                timestamp: new Date().getTime().toString(),
            });
            await redis.set(config.redisPrefix + 'last-' + msg.recordingId, msg.sequenceNumber);
            last = msg.sequenceNumber;
        }
        else {
            await redis.hSet(config.redisPrefix + 'waiting-' + msg.recordingId, msg.sequenceNumber, JSON.stringify(msg));
        }
        // test waiting
        let w;
        while ((w = await redis.hGet(config.redisPrefix + 'waiting-' + msg.recordingId, (last + 1).toString()))) {
            const waiting = JSON.parse(w);
            await sendData(config.outputTopic, {
                key: waiting.user,
                value: w,
                timestamp: new Date().getTime().toString(),
            });
            last = waiting.sequenceNumber;
            await redis.set(config.redisPrefix + 'last-' + msg.recordingId, last);
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
