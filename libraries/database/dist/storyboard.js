import { getP, getR } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
const logger = initLogger('database-storyboard');
export async function createTable() {
    const { pool } = getP();
    // test for tables
    const tabletest = await pool.query(`SELECT EXISTS (
    SELECT FROM pg_tables
    WHERE  schemaname = 'public'
    AND    tablename  = 'storyboard'
    );`);
    if (!tabletest.rows[0].exists) {
        await pool.query(`
    create table storyboard (
      id bigserial primary key,
      recording_id bigint not null,
      offset integer not null,
      interval smallint not null,
      slug text not null,
    );

    create index storyboard_recording_id_idx on storyboard(recording_id);
    create index storyboard_offset_idx on storyboard(offset);
    create index storyboard_slug_idx on storyboard(slug);
      `);
    }
}
export async function screenshotReady(recordingId, sbIndex, data) {
    const { redis, prefix } = getR();
    const name = prefix + recordingId + sbIndex.toString();
    await redis.lPush(name, JSON.stringify(data));
    const list = await redis.lRange(name, 0, -1);
    const result = list.map((l) => JSON.parse(l));
    return result;
}
export async function getAllScreenshots(recordingId, sbIndex) {
    const { redis, prefix } = getR();
    const name = prefix + recordingId + sbIndex.toString();
    const list = await redis.lRange(name, 0, -1);
    const result = list.map((l) => JSON.parse(l));
    return result;
}
export async function clearScreenshots(recordingId, sbIndex) {
    const { redis, prefix } = getR();
    await redis.del(prefix + recordingId + sbIndex.toString());
}
export async function incBoardCount(recordingId) {
    const { redis, prefix } = getR();
    return await redis.incr(prefix + recordingId + '-board-count');
}
export async function getBoardCount(recordingId) {
    const { redis, prefix } = getR();
    const value = await redis.get(prefix + recordingId + '-board-count');
    if (value === null || value === undefined)
        return 0;
    return parseInt(value);
}
export async function clearAll(recordingId) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId }, 'clear all');
    await redis.del(prefix + recordingId + '-board-count');
}
