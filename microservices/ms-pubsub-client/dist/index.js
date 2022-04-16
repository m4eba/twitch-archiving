import { KafkaConfigOpt, TwitchConfigOpt, FileConfigOpt } from '@twitch-archiving/config';
import pino from 'pino';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { Connection } from '@twitch-archiving/pubsub';
const PubsubConfigOpt = {
    topics: { type: String, multiple: true },
    channels: { type: String, multiple: true },
    kafkaTopics: { type: String, multiple: true }
};
const config = parse({
    ...KafkaConfigOpt,
    ...PubsubConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = pino({ level: 'debug' }).child({ module: 'pubsub-client' });
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
const producer = kafka.producer();
await producer.connect();
const authProvider = new ClientCredentialsAuthProvider(config.twitchClientId, config.twitchClientSecret);
const twitch = new ApiClient({ authProvider });
const token = await authProvider.getAccessToken();
if (token === null) {
    logger.debug({ clientId: config.twitchClientId }, 'unable to authenticate');
    process.exit(1);
}
for (let i = 0; i < config.channels.length; ++i) {
    const user = await twitch.users.getUserByName(config.channels[i]);
    if (user === null)
        continue;
    const topics = config.topics.map(t => t + user.id);
    const connection = new Connection(token.accessToken, topics);
    connection.addListener({
        message: (data) => {
            sendData(user.name, data).catch(e => {
                logger.debug({ error: e }, 'error while sending');
            });
        }
    });
}
async function sendData(user, data) {
    const time = new Date();
    const messages = [];
    for (let i = 0; i < config.kafkaTopics.length; ++i) {
        const value = {
            id: user,
            data: data.toString().trim()
        };
        const topicMessage = {
            topic: config.kafkaTopics[i],
            messages: [
                {
                    key: user,
                    value: JSON.stringify(value),
                    timestamp: time.getTime().toString(),
                },
            ],
        };
        messages.push(topicMessage);
    }
    logger.debug({ id: user, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
}
