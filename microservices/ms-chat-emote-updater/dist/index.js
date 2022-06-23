import { KafkaConfigOpt, FileConfigOpt, TwitchConfigOpt, RedisConfigOpt, } from '@twitch-archiving/config';
import 'path';
import fs from 'fs';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import '@twitch-archiving/utils';
import { initRedis, chat } from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';
import { seventv, bettertv, ffz, } from '@twitch-archiving/chat';
const UpdateConfigOpt = {
    topic: { type: String, defaultValue: 'tw-chat-emotes-updater' },
    channelFile: { type: String },
    interval: { type: Number, defaultValue: 30 * 60 },
    redisPrefix: { type: String, defaultValue: 'tw-chat-emotes' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...RedisConfigOpt,
    ...UpdateConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
await initRedis(config, config.redisPrefix);
const logger = initLogger('chat-emote-updater');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
const authProvider = new ClientCredentialsAuthProvider(config.twitchClientId, config.twitchClientSecret);
const client = new ApiClient({ authProvider });
const channelSet = new Map();
await readChannels();
fs.watch(config.channelFile, readChannels);
const producer = kafka.producer();
await producer.connect();
await update();
setInterval(update, config.interval * 1000);
async function update() {
    const msg = [];
    let global = [];
    {
        const { data, emotes } = await seventv.globalEmotes();
        global = global.concat(emotes);
    }
    {
        const { data, emotes } = await bettertv.globalEmotes();
        global = global.concat(emotes);
    }
    await chat.setGlobalEmotes(global);
    logger.trace({ global }, 'global emotes received');
    await channelSet.forEach(async (id, channel) => {
        let ce = [];
        {
            const { data, emotes } = await bettertv.channelEmotes(id);
            ce = ce.concat(emotes);
        }
        {
            const { data, emotes } = await seventv.channelEmotes(channel);
            ce = ce.concat(emotes);
        }
        {
            const { data, emotes } = await ffz.channelEmotes(channel);
            ce = ce.concat(emotes);
        }
        await chat.setChannelEmotes(channel, ce);
        logger.trace({ channel, emotes: ce }, 'channel emotes received');
        msg.push({
            key: channel,
            value: JSON.stringify({ emotes: ce, global }),
            timestamp: new Date().getTime().toString(),
        });
    });
    await sendData(config.topic, msg);
}
async function readChannels() {
    const content = await fs.promises.readFile(config.channelFile, {
        encoding: 'utf8',
    });
    const channels = content.split('\n');
    logger.trace({ channels }, 'channels');
    channels.forEach(async (v) => {
        const split = v.split(' ');
        const username = split[0];
        const id = split[1];
        channelSet.set(username, id);
    });
}
async function sendData(topic, msg) {
    const messages = [];
    const topicMessage = {
        topic,
        messages: msg,
    };
    messages.push(topicMessage);
    logger.debug({ topic: topic, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
}
