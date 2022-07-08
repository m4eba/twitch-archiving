import { getPool, getR, getP } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
const logger = initLogger('database-chat');
const CHANNEL_EMOTES = (prefix, channel) => {
    return `${prefix}-emotes-${channel}`;
};
const GLOBAL_EMOTES = (prefix) => {
    return `${prefix}-global-emotes`;
};
export async function createTable() {
    const pool = getPool();
    if (pool === undefined) {
        throw new Error('database not initialized');
    }
    // test for tables
    const tabletest = await pool.query(`SELECT EXISTS (
  SELECT FROM pg_tables
  WHERE  schemaname = 'public'
  AND    tablename  = 'chat_message'
  );`);
    if (!tabletest.rows[0].exists) {
        await pool.query(`
    create table chat_message (
      id uuid primary key,
      channel text not null,
      username text not null,
      message text not null,
      time timestamptz not null,
      data jsonb not null,
      emotes jsonb not null
    );
    
    create index chat_message_channel_idx on chat_message (channel);
    create index chat_message_username_idx on chat_message (username);
    create index chat_message_time_idx on chat_message (time);
    create index chat_message_message_idx on chat_message using GIN(to_tsvector('english',message));

    create type emote_source as enum ('twitch','bttv','ffz','7tv'); 
    create table chat_emote (
      id text not null,
      source emote_source not null,
      name text not null,
      ext text not null,
      data jsonb not null,
      primary key(id,source)
    );

    create index chat_emote_name_idx on chat_emote (name);

    create table chat_message_emote (
      message_id uuid not null,
      emote_id uuid not null,
      emote_source uuid not null,
      start_idx integer not null,
      end_idx integer not null,
      primary key(message_id,emote_id,emote_source,start_idx)
    );
    `);
    }
}
export async function insertMessage(msg) {
    const { pool } = getP();
    await pool.query('INSERT into chat_message (id, channel, username, message, time, data, emotes ) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING', [
        msg.id,
        msg.channel,
        msg.username,
        msg.message,
        msg.time,
        JSON.stringify(msg.data),
        JSON.stringify(msg.emotes),
    ]);
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
