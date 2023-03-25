import { KafkaConfigOpt, TwitchConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { ClientCredentialsAuthProvider, } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { Connection } from '@twitch-archiving/pubsub';
import { initLogger } from '@twitch-archiving/utils';
const PubsubConfigOpt = {
    topics: { type: String, multiple: true },
    channels: { type: String, multiple: true },
    kafkaTopic: { type: String, defaultValue: 'tw-pubsub-events' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PubsubConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('pubsub-client');
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
    logger.debug({ channel: config.channels[i] }, 'create new connection');
    const user = await twitch.users.getUserByName(config.channels[i]);
    if (user === null)
        continue;
    const topics = config.topics.map((t) => t.replace('$ID', user.id));
    logger.debug({ topics: topics }, 'channel topics');
    const connection = new Connection(token.accessToken, topics);
    connection.addListener({
        message: (data) => {
            sendData(user.name, data).catch((e) => {
                logger.debug({ error: e }, 'error while sending');
            });
        },
    });
    await connection.open();
}
async function sendData(user, data) {
    const time = new Date();
    const messages = [];
    const topicMessage = {
        topic: config.kafkaTopic,
        messages: [
            {
                key: user,
                value: data,
                timestamp: time.getTime().toString(),
            },
        ],
    };
    messages.push(topicMessage);
    logger.debug({ id: user, size: messages.length }, 'sending batch');
    logger.trace({ id: user, messages }, 'sending messages');
    await producer.sendBatch({ topicMessages: messages });
}
