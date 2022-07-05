import type { Logger } from 'pino';
import { getP, getR } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
import crypto from 'crypto';

const logger: Logger = initLogger('database-storyboard');

export interface Storyboard {
  recording_id: string;
  index: number;
  time_offset: number;
  interval: number;
  first_sequence: number;
  rows: number;
  columns: number;
  slug: string;
  data: StoryboardData;
}

export interface StoryboardData {
  current_offset: number;
  images: string[];
}

export async function createTable(): Promise<void> {
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
      time_offset int not null,
      interval smallint not null,
      rows smallint not null,
      columns smallint not null,
      slug text not null,
      data jsonb not null,
      PRIMARY KEY(recording_id, index)
    );

    create index storyboard_time_offset_idx on storyboard(time_offset);
    create index storyboard_slug_idx on storyboard(slug);
      `);
  }
}

export async function insertStoryboard(sb: Storyboard): Promise<Storyboard> {
  const { pool } = getP();

  const slug = crypto.randomUUID();
  const newSb: Storyboard = { ...sb };
  const result = await pool.query(
    'INSERT INTO storyboard (recording_id, index, first_sequence, time_offset, interval, rows, columns, slug, data) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
    [
      sb.recording_id,
      sb.index,
      sb.first_sequence,
      sb.time_offset,
      sb.interval,
      sb.rows,
      sb.columns,
      slug,
      JSON.stringify(sb.data),
    ]
  );
  return newSb;
}

export async function getStoryboard(
  recordingId: string,
  index: number
): Promise<Storyboard | undefined> {
  const { pool } = getP();

  const result = await pool.query(
    'SELECT * from storyboard WHERE recording_id = $1 and index = $2 desc LIMIT 1',
    [recordingId, index]
  );
  if (result.rowCount === 0) {
    return undefined;
  }
  const sb: Storyboard = {
    ...result.rows[0],
  };
  return sb;
}

export async function getLatestStoryBoard(
  recordingId: string
): Promise<Storyboard | undefined> {
  const { pool } = getP();

  const result = await pool.query(
    'SELECT * from storyboard WHERE recording_id = $1 order by index desc LIMIT 1',
    [recordingId]
  );
  if (result.rowCount === 0) {
    return undefined;
  }
  const sb: Storyboard = {
    ...result.rows[0],
  };
  return sb;
}

export async function updateStoryboard(sb: Storyboard): Promise<void> {
  const { pool } = getP();

  await pool.query(
    'UPDATE storyboard SET index=$1, time_offset=$2, first_sequence=$3, data=$4 WHERE recording_id = $5 and index = $6 ',
    [
      sb.index,
      sb.time_offset,
      sb.first_sequence,
      sb.data,
      sb.recording_id,
      sb.index,
    ]
  );
}
