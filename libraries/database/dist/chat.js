import { getR, getRecPrismaClient } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
const logger = initLogger('database-chat');
const CHANNEL_EMOTES = (prefix, channel) => {
    return `${prefix}-emotes-${channel}`;
};
const GLOBAL_EMOTES = (prefix) => {
    return `${prefix}-global-emotes`;
};
export async function insertMessage(msg) {
    const client = getRecPrismaClient();
    await client.chatMessage.create({
        data: {
            ...msg,
            data: msg.data,
            emotes: msg.emotes,
        },
    });
}
export async function setChannelEmotes(channel, emotes) {
    const { redis, prefix } = getR();
    await redis.set(CHANNEL_EMOTES(prefix, channel), JSON.stringify(emotes));
}
export async function getChannelEmotes(channel) {
    const { redis, prefix } = getR();
    const data = await redis.get(CHANNEL_EMOTES(prefix, channel));
    if (data === null || data === undefined)
        return [];
    return JSON.parse(data);
}
export async function setGlobalEmotes(emotes) {
    const { redis, prefix } = getR();
    await redis.set(GLOBAL_EMOTES(prefix), JSON.stringify(emotes));
}
export async function getGlobalEmotes() {
    const { redis, prefix } = getR();
    const data = await redis.get(GLOBAL_EMOTES(prefix));
    if (data === null || data === undefined)
        return [];
    return JSON.parse(data);
}
