import { KafkaConfigOpt, FileConfigOpt, PostgresConfigOpt, TwitchConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { DateTime } from 'luxon';
import { initLogger, fetchWithTimeoutText } from '@twitch-archiving/utils';
import { initPostgres } from '@twitch-archiving/database';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
const SchedulerConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-clips-list' },
    outputTopic: { type: String, defaultValue: 'tw-clips' },
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
const logger = initLogger('clips-list');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initPostgres(config);
const consumer = kafka.consumer({ groupId: 'clip-list' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
const authProvider = new ClientCredentialsAuthProvider(config.twitchClientId, config.twitchClientSecret);
const apiClient = new ApiClient({ authProvider });
async function clips(channel_id, access_token, token, start, end) {
    let url = `https://api.twitch.tv/helix/clips?broadcaster_id=${channel_id}&first=100`;
    if (token.length > 0) {
        url += `&after=${token}`;
    }
    if (start) {
        url += `&started_at=${start}&ended_at=${end}`;
    }
    logger.debug({ url }, 'fetch url');
    const headers = {
        Accept: 'application/vnd.twitchtv.v5+json',
        'Client-Id': config.twitchClientId,
        Authorization: 'Bearer ' + access_token,
    };
    const result = await fetchWithTimeoutText(url, 3, 3000, headers);
    return result.data;
}
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        const user = message.key.toString();
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        if (msg.accessToken.length === 0) {
            const token = await authProvider.getAccessToken();
            if (token === null) {
                throw new Error('unable to get token');
            }
            // eslint-disable-next-line require-atomic-updates
            msg.accessToken = token.accessToken;
        }
        const result = JSON.parse(await clips(msg.channel_id, msg.accessToken, msg.pagination, msg.start, msg.end));
        msg.count += result.data.length;
        result.data.forEach(async (c) => {
            const cd = {
                channel: msg.channel,
                clip: c,
            };
            await sendData(config.outputTopic, {
                key: user,
                value: JSON.stringify(cd),
                timestamp: new Date().getTime().toString(),
            });
        });
        if (msg.count > 1900) {
            const s = DateTime.fromISO(msg.start);
            const e = DateTime.fromISO(msg.end);
            const sn = parseInt(s.toFormat('X'));
            const en = parseInt(e.toFormat('X'));
            const diff = en - sn;
            if (diff > 1) {
                // split time and redo
                const middle = DateTime.fromSeconds(sn + Math.ceil(diff / 2))
                    .toUTC()
                    .toISO();
                const msg_first = {
                    ...msg,
                    start: msg.start,
                    end: middle,
                };
                await sendData(config.inputTopic, {
                    key: user,
                    value: JSON.stringify(msg_first),
                    timestamp: new Date().getTime().toString(),
                });
                const msg_second = {
                    ...msg,
                    start: middle,
                    end: msg.end,
                };
                await sendData(config.inputTopic, {
                    key: user,
                    value: JSON.stringify(msg_second),
                    timestamp: new Date().getTime().toString(),
                });
                return;
            }
        }
        if (result.pagination && result.pagination.cursor) {
            const msg_second = {
                ...msg,
                pagination: result.pagination.cursor,
            };
            await sendData(config.inputTopic, {
                key: user,
                value: JSON.stringify(msg_second),
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
