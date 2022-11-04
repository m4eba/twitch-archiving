import { KafkaConfigOpt, FileConfigOpt, PostgresConfigOpt, TwitchConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { initLogger } from '@twitch-archiving/utils';
import { initPostgres } from '@twitch-archiving/database';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
const SchedulerConfigOpt = {
    interval: { type: Number, defaultValue: 10 * 60 },
    user: { type: String, multiple: true },
    outputTopic: { type: String, defaultValue: 'tw-clips-list' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...SchedulerConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('clips-live-scheduler');
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
    const accessToken = await authProvider.getAccessToken();
    const stream = await apiClient.streams.getStreamByUserName(user);
    logger.debug({ stream, user }, 'test user');
    if (stream !== null) {
        const msg = {
            channel: user,
            channel_id: stream.userId,
            start: stream.startDate.toISOString(),
            end: new Date().toISOString(),
            pagination: '',
            count: 0,
            accessToken: accessToken ? accessToken.accessToken : '',
        };
        await sendData(config.outputTopic, {
            key: user,
            value: JSON.stringify(msg),
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
