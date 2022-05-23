import type { Pool } from 'pg';
import { RedisClient, getPool, getRedis, getRedisPrefix } from './init.js';
import type { PlaylistMessage } from '@twitch-archiving/messages';

export interface Recording {
  id: string;
  start: Date;
  stop: Date | undefined;
  channel: string;
  site_id: string;
}

export interface File {
  recording_id: string;
  name: string;
  seq: number;
  retries: number;
  duration: number;
  datetime: Date;
  size: number;
  downloaded: number;
  hash: string;
  status: string;
}

export async function createTableDownload(): Promise<void> {
  const pool: Pool | undefined = getPool();
  if (pool === undefined) {
    throw new Error('database not initialized');
  }
  // test for tables
  const tabletest = await pool.query(`SELECT EXISTS (
  SELECT FROM pg_tables
  WHERE  schemaname = 'public'
  AND    tablename  = 'file'
  );`);

  if (!tabletest.rows[0].exists) {
    await pool.query(`
    create table recording (
      id BIGSERIAL primary key,
      start timestamptz not null,
      stop timestamptz,
      channel text not null,
      site_id text not null DEFAULT ''
    );
    
    create index recording_channel_idx on recording (channel);
    create index recording_site_id_idx on recording (site_id);
    create index recording_start_idx on recording (start);
    create index recording_stop_idx on recording (stop);

    create type file_status as enum ('downloading', 'error', 'done'); 
    create table file (
      recording_id integer not null,
      name text not null,
      seq integer not null,          
      retries smallint not null,
      duration decimal not null,
      datetime timestamptz not null,
      size integer not null,
      downloaded integer not null,
      hash text not null,
      status file_status,
      PRIMARY KEY(recording_id, name)
    );

    create index file_recording_id on file(recording_id);
    create index file_name_idx on file (name);
    create index file_seq_idx on file (seq);
    create index file_status on file (status);
    `);
  }
}

function getPR(): { pool: Pool; redis: RedisClient; prefix: string } {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  const redis = getRedis();
  if (redis === undefined) throw new Error('redis not initialized');
  return {
    pool,
    redis,
    prefix: getRedisPrefix(),
  };
}

function getR(): { redis: RedisClient; prefix: string } {
  const redis = getRedis();
  if (redis === undefined) throw new Error('redis not initialized');
  return {
    redis,
    prefix: getRedisPrefix(),
  };
}

function getP(): { pool: Pool } {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  return {
    pool,
  };
}

export async function setPlaylistMessage(data: PlaylistMessage): Promise<void> {
  const { redis, prefix } = getR();
  await redis.set(prefix + '-stream-' + data.user, JSON.stringify(data));
}

export async function getPlaylistMessage(
  user: string
): Promise<PlaylistMessage | undefined> {
  const { redis, prefix } = getR();
  const data = await redis.get(prefix + '-stream-' + user);
  if (data === null) return undefined;
  return JSON.parse(data);
}

export async function setPlaylistEnding(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  await redis.set(prefix + recordingId + '-playlist-ending', 1);
}

export async function isPlaylistEnding(recordingId: string): Promise<boolean> {
  const { redis, prefix } = getR();
  return (await redis.get(prefix + recordingId + '-playlist-ending')) !== null;
}

export async function startRecording(
  time: Date,
  channel: string,
  site_id: string
): Promise<string> {
  const { pool, redis, prefix } = getPR();
  const result = await pool.query(
    'INSERT into recording VALUES (DEFAULT, $1, null, $2, $3) RETURNING id',
    [time, channel, site_id]
  );
  const id = result.rows[0].id;

  await redis.set(prefix + channel + '-recordingId', id);
  await redis.sAdd(prefix + '-streams', channel);

  return id;
}

export async function stopRecording(
  time: Date,
  recordingId: string
): Promise<void> {
  const { pool, redis, prefix } = getPR();

  const recording = await getRecording(recordingId);
  if (!recording) return;
  const channel = recording.channel;
  await pool.query('UPDATE recording SET stop=$1 WHERE  id = $2', [
    time,
    recordingId,
  ]);

  await redis.del(prefix + channel + '-recordingId');
  await redis.sRem(prefix + '-streams', channel);
  await redis.del(prefix + channel + '-playlist-ending');
}

export async function isRecording(channel: string): Promise<boolean> {
  const { redis, prefix } = getR();
  return await redis.sIsMember(prefix + '-streams', channel);
}

export async function getRecordingId(channel: string): Promise<string> {
  const { redis, prefix } = getR();
  const id = await redis.get(prefix + channel + '-recordingId');
  if (!id) return '';
  return id;
}

export async function getRecording(id: string): Promise<Recording | undefined> {
  const { pool } = getP();

  const result = await pool.query('SELECT * FROM recording WHERE id = $1', [
    id,
  ]);
  if (result.rows.length === 0) {
    return undefined;
  }
  return {
    id: result.rows[0].id,
    start: result.rows[0].start,
    stop: result.rows[0].stop,
    channel: result.rows[0].channel,
    site_id: result.rows[0].site_id,
  };
}

export async function updateSiteId(
  recordingId: string,
  siteId: string
): Promise<void> {
  const { pool } = getP();

  await pool.query('UPDATE recording SET site_id=$1 WHERE id = $2', [
    siteId,
    recordingId,
  ]);
}

export async function startFile(
  recordingId: string,
  name: string,
  seq: number,
  duration: number,
  time: Date
): Promise<void> {
  const { pool } = getP();

  await pool.query(
    'INSERT into file (recording_id,name,seq,retries,duration,datetime,size,downloaded,hash,status) VALUES ($1,$2,$3,0,$4,$5,0,0,$6,$7)',
    [recordingId, name, seq, duration, time, '', 'downloading']
  );
}

export async function addSegment(
  recordingId: string,
  sequenceNumber: number
): Promise<void> {
  const { redis, prefix } = getR();

  await redis.sAdd(
    prefix + recordingId + '-segments',
    sequenceNumber.toString()
  );
}

export async function finishedFile(
  recordingId: string,
  sequenceNumber: number
): Promise<void> {
  const { redis, prefix } = getR();

  await redis.sRem(
    prefix + recordingId + '-segments',
    sequenceNumber.toString()
  );
  if (
    (await isPlaylistEnding(recordingId)) &&
    (await redis.sCard(prefix + recordingId + '-segments')) === 0
  ) {
    await stopRecording(new Date(), recordingId);
  }
}

export async function getFile(
  recordingId: string,
  name: string
): Promise<File | undefined> {
  const { pool } = getP();

  const result = await pool.query(
    'SELECT * FROM file WHERE recording_id = $1 AND name = $2',
    [recordingId, name]
  );
  if (result.rows.length === 0) {
    return undefined;
  }
  return {
    recording_id: result.rows[0].recording_id,
    name: result.rows[0].name,
    seq: result.rows[0].seq,
    retries: result.rows[0].retries,
    duration: result.rows[0].duration,
    datetime: result.rows[0].datetime,
    size: result.rows[0].size,
    downloaded: result.rows[0].downloaded,
    hash: result.rows[0].hash,
    status: result.rows[0].status,
  };
}

export async function updateFileSize(
  recordingId: string,
  name: string,
  size: number
): Promise<void> {
  const { pool } = getP();

  await pool.query(
    'UPDATE file SET size=$1 WHERE recording_id = $2 AND name = $3',
    [size, recordingId, name]
  );
}

export async function updateFileDownloadSize(
  recordingId: string,
  name: string,
  size: number
): Promise<void> {
  const { pool } = getP();

  await pool.query(
    'UPDATE file SET downloaded=$1 WHERE recording_id = $2 AND name = $3',
    [size, recordingId, name]
  );
}

export async function updateFileStatus(
  recordingId: string,
  name: string,
  status: string
): Promise<void> {
  const { pool } = getP();

  await pool.query(
    'UPDATE file SET status=$1 WHERE recording_id = $2 AND name = $3',
    [status, recordingId, name]
  );
}

export async function incrementFileRetries(
  recordingId: string,
  name: string
): Promise<void> {
  const { pool } = getP();

  await pool.query(
    'UPDATE file SET retries=retires+1 WHERE recording_id = $1 AND name = $2',
    [recordingId, name]
  );
}
