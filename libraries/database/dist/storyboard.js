import { getP } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
import crypto from 'crypto';
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
      recording_id bigint not null,
      index smallint not null,
      first_sequence int not null,
      offset int not null,
      interval smallint not null,
      rows smallint not null,
      columns smallint not null,
      slug text not null,
      data jsonb not null,
      PRIMARY KEY(recording_id, index)
    );

    create index storyboard_offset_idx on storyboard(offset);
    create index storyboard_slug_idx on storyboard(slug);
      `);
    }
}
export async function insertStoryboard(sb) {
    const { pool } = getP();
    const slug = crypto.randomUUID();
    const newSb = { ...sb };
    const result = await pool.query('INSERT INTO storyboard (recording_id, index, first_sequence, offset, interval, rows, columns, slug, data) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id', [
        sb.recording_id,
        sb.index,
        sb.first_sequence,
        sb.offset,
        sb.interval,
        sb.rows,
        sb.columns,
        slug,
        JSON.stringify(sb.data),
    ]);
    const id = result.rows[0].id;
    newSb.id = id;
    return newSb;
}
export async function getStoryboard(recordingId, index) {
    const { pool } = getP();
    const result = await pool.query('SELECT * from storyboard WHERE recording_id = $1 and index = $2 desc LIMIT 1', [recordingId, index]);
    if (result.rowCount === 0) {
        return undefined;
    }
    const sb = {
        ...result.rows[0],
    };
    return sb;
}
export async function getLatestStoryBoard(recordingId) {
    const { pool } = getP();
    const result = await pool.query('SELECT * from storyboard WHERE recording_id = $1 order by index desc LIMIT 1', [recordingId]);
    if (result.rowCount === 0) {
        return undefined;
    }
    const sb = {
        ...result.rows[0],
    };
    return sb;
}
export async function updateStoryboard(sb) {
    const { pool } = getP();
    await pool.query('UPDATE storyboard SET index=$1, offset=$2, first_sequence=$3, data=$4 WHERE recording_id = $5 and index = $6 ', [sb.index, sb.offset, sb.first_sequence, sb.data, sb.recording_id, sb.index]);
}
