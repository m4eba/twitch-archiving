import type { Pool } from 'pg';
import type { Logger } from 'pino';
import { getP } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
import type { TwitchClip } from '@twitch-archiving/model';

const logger: Logger = initLogger('database-clips');

export interface Clip {
  id: string;
  created_at: string;
  last_update: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  title: string;
  video_id: string;
  video_offset: number;
  thumbnail_url: string;
  view_count: number;
  duration: number;
  online: boolean;
  data: any;
}

export async function createTableClips(): Promise<void> {
  const { pool } = getP();
  if (pool === undefined) {
    throw new Error('database not initialized');
  }
  // test for tables
  const tabletest = await pool.query(`SELECT EXISTS (
    SELECT FROM pg_tables
    WHERE  schemaname = 'public'
    AND    tablename  = 'clips'
    );`);

  if (!tabletest.rows[0].exists) {
    await pool.query(`
    create table clips (
      id text primary key,
      created_at timestamptz not null,
      last_update timestamptz not null,
      broadcaster_id text not null,
      broadcaster_name text not null,
      creator_id text not null,
      creator_name text not null,
      title text not null,
      video_id text not null,
      video_offset int not null,
      thumbnail_url text not null,      
      view_count int not null,
      duration decimal not null,
      online boolean not null,
      data jsonb null
    );

    create index clips_created_at on clips (created_at);
    create index clips_broadcaster_id on clips (broadcaster_id);
    create index clips_creator_id on clips (creator_id);
    create index clips_video_id on clips (video_id);
    create index clips_title on clips (title);
    create index clips_online on clips (online);

    create table clips_views (
      id text not null,
      date timestamptz not null,
      view_count int not null,
      PRIMARY KEY(id,view_count)
    );

    create index clips_views_date on clips_views (date);
    `);
  }
}

export async function getClip(id: string): Promise<Clip | undefined> {
  const { pool } = getP();

  const result = await pool.query('SELECT * from clips WHere id =$1', [id]);
  if (result.rows.length === 0) {
    return undefined;
  }
  return {
    id: result.rows[0].id,
    created_at: result.rows[0].created_at,
    last_update: result.rows[0].last_update,
    broadcaster_id: result.rows[0].broadcaster_id,
    broadcaster_name: result.rows[0].broadcaster_name,
    creator_id: result.rows[0].creator_id,
    creator_name: result.rows[0].creator_name,
    title: result.rows[0].title,
    video_id: result.rows[0].video_id,
    video_offset: result.rows[0].video_offset,
    thumbnail_url: result.rows[0].thumbnail_url,
    view_count: result.rows[0].view_count,
    duration: result.rows[0].duration,
    online: result.rows[0].online,
    data: result.rows[0].data,
  };
}

export async function insertClip(
  clip: TwitchClip,
  offset: number,
  data: any
): Promise<void> {
  const { pool } = getP();
  const time = new Date().toISOString();
  await pool.query(
    'INSERT into clips VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',
    [
      clip.id,
      clip.created_at,
      time,
      clip.broadcaster_id,
      clip.broadcaster_name,
      clip.creator_id,
      clip.creator_name,
      clip.title,
      clip.video_id,
      offset,
      clip.thumbnail_url,
      clip.view_count,
      clip.duration,
      true,
      data,
    ]
  );
  await pool.query(
    'INSERT INTO clips_views VALUES ($1,$2,$3) ON CONFLICT DO NOTHING ',
    [clip.id, time, clip.view_count]
  );
}

export async function updateViewCount(
  id: string,
  view_count: number
): Promise<void> {
  const { pool } = getP();

  const time = new Date().toISOString();
  await pool.query(
    'INSERT INTO clips_views VALUES ($1,$2,$3) ON CONFLICT DO NOTHING ',
    [id, time, view_count]
  );
  await pool.query(
    'UPDATE clips SET view_count = $1, last_update = $2 WHERE id = $3',
    [view_count, time, id]
  );
}

export async function updateStatus(id: string, status: string): Promise<void> {
  const { pool } = getP();

  const time = new Date().toISOString();
  await pool.query(
    'UPDATE clips SET status= $1, last_update = $2 WHERE id = $3',
    [status, time, id]
  );
}

export async function updateOnline(id: string, online: boolean): Promise<void> {
  const { pool } = getP();

  const time = new Date().toISOString();
  await pool.query(
    'UPDATE clips SET online = $1, last_update = $2 WHERE id = $3',
    [online, time, id]
  );
}
