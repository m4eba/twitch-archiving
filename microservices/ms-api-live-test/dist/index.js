import { KafkaConfigOpt, PostgresConfigOpt, FileConfigOpt, TwitchConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { initLogger } from '@twitch-archiving/utils';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { download as dl, initPostgres } from '@twitch-archiving/database';
const LiveTestConfigOpt = {
    outputTopic: { type: String, defaultValue: 'tw-live' },
    user: { type: String, multiple: true },
    interval: { type: Number, defaultValue: 60 },
};
const config = parse({
    ...KafkaConfigOpt,
    ...LiveTestConfigOpt,
    ...PostgresConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('api-live-test');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initPostgres(config);
const producer = kafka.producer();
await producer.connect();
const authProvider = new ClientCredentialsAuthProvider(config.twitchClientId, config.twitchClientSecret);
const apiClient = new ApiClient({ authProvider });
async function testUser(user) {
    const recording = await dl.getRunningRecording(user);
    logger.trace({ recording, user }, 'test recording');
    if (!recording)
        return;
    const stream = await apiClient.streams.getStreamByUserName(user);
    logger.debug({ stream, user }, 'test user');
    if (stream !== null) {
        logger.trace({ user }, 'send reload');
        sendData(config.outputTopic, {
            key: user,
            value: JSON.stringify({ forceReload: true }),
            timestamp: new Date().getTime().toString(),
        });
    }
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
config.user.forEach((u) => testUser(u));
setInterval(() => {
    config.user.forEach((u) => testUser(u));
}, config.interval * 1000);
