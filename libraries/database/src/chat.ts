import type { Pool } from 'pg';
import type { Logger } from 'pino';
import { getPool, getR, getP, getPR, getRecPrismaClient } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
import type { EmoteData, Emote, ChatMessage } from '@twitch-archiving/model';
import type { Prisma } from '@twitch-archiving/prisma/prisma/generated/rec-client/index.js';

const logger: Logger = initLogger('database-chat');

const CHANNEL_EMOTES = (prefix: string, channel: string): string => {
  return `${prefix}-emotes-${channel}`;
};
const GLOBAL_EMOTES = (prefix: string): string => {
  return `${prefix}-global-emotes`;
};

export async function insertMessage(msg: ChatMessage): Promise<void> {
  const client = getRecPrismaClient();

  await client.chatMessage.upsert({
    create: {
      ...msg,
      data: msg.data as Prisma.InputJsonObject,
      emotes: msg.emotes as any,
    },
    where: {
      id: msg.id,
    },
    update: {
      ...msg,
      emotes: msg.emotes as any,
    },
  });
}

export async function setChannelEmotes(
  channel: string,
  emotes: Emote[]
): Promise<void> {
  const { redis, prefix } = getR();
  await redis.set(CHANNEL_EMOTES(prefix, channel), JSON.stringify(emotes));
}

export async function getChannelEmotes(channel: string): Promise<Emote[]> {
  const { redis, prefix } = getR();
  const data = await redis.get(CHANNEL_EMOTES(prefix, channel));
  if (data === null || data === undefined) return [];
  return JSON.parse(data);
}

export async function setGlobalEmotes(emotes: Emote[]): Promise<void> {
  const { redis, prefix } = getR();
  await redis.set(GLOBAL_EMOTES(prefix), JSON.stringify(emotes));
}

export async function getGlobalEmotes(): Promise<Emote[]> {
  const { redis, prefix } = getR();
  const data = await redis.get(GLOBAL_EMOTES(prefix));
  if (data === null || data === undefined) return [];
  return JSON.parse(data);
}
