import type { Pool } from 'pg';
import type { Logger } from 'pino';
import { getPool, getR, getP, getPR } from './init.js';
import type {
  AccessToken,
  PlaylistMessage,
  PlaylistType,
} from '@twitch-archiving/messages';
import { initLogger } from '@twitch-archiving/utils';

const logger: Logger = initLogger('database-download');

const MAX_PLAYLIST_ERROR: number = 3;

export interface Recording {
  id: string;
  start: Date;
  stop: Date | null;
  channel: string;
  site_id: string;
  data: RecordingData | null;
}

export interface RecordingData {
  type: PlaylistType;
  playlist: string;
  token: AccessToken;
  bestUrl: string;
}

export interface File {
  recording_id: string;
  name: string;
  seq: number;
  time_offset: number;
  duration: number;
  retries: number;
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
      site_id text not null DEFAULT '',
      data jsonb null
    );
    
    create index recording_channel_idx on recording (channel);
    create index recording_site_id_idx on recording (site_id);
    create index recording_start_idx on recording (start);
    create index recording_stop_idx on recording (stop);

    create type file_status as enum ('downloading', 'error', 'done', 'waiting'); 
    create table file (
      recording_id bigint not null,
      name text not null,
      seq integer not null,                
      time_offset decimal not null,
      duration decimal not null,
      retries smallint not null,
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

export async function startRecording(
  time: Date,
  channel: string,
  site_id: string,
  data: RecordingData
): Promise<string> {
  const { pool, redis, prefix } = getPR();
  const result = await pool.query(
    'INSERT into recording (id, start, stop, channel, site_id, data) VALUES (DEFAULT, $1, null, $2, $3, $4) RETURNING id',
    [time, channel, site_id, JSON.stringify(data)]
  );
  const id = result.rows[0].id;

  await redis.set(prefix + channel + '-recordingId', id);
  await redis.sAdd(prefix + '-streams', channel);

  return id;
}

export async function resumeRecording(recordingId: string): Promise<void> {
  const { pool } = getP();
  await pool.query('UPDATE recording SET stop=null WHERE  id = $1', [
    recordingId,
  ]);
}

export async function stopRecording(
  time: Date,
  recordingId: string
): Promise<void> {
  const { pool } = getP();

  await pool.query('UPDATE recording SET stop=$1 WHERE  id = $2', [
    time,
    recordingId,
  ]);
}

export async function updateRecordingData(
  recordingId: string,
  data: RecordingData
): Promise<void> {
  const { pool } = getP();
  await pool.query('UPDATE recording SET data=$1 WHERE  id = $2', [
    JSON.stringify(data),
    recordingId,
  ]);
}

export async function getRecordedChannels(): Promise<string[]> {
  const { pool } = getP();
  const channels = await pool.query(
    'select channel from recording where stop is null group by channel'
  );
  const result = [];
  for (let i = 0; i < channels.rows.length; ++i) {
    result.push(channels.rows[i][0]);
  }
  return result;
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
    data: result.rows[0].data,
  };
}

export async function getRunningRecording(
  channel: string
): Promise<Recording | undefined> {
  const { pool } = getP();

  const result = await pool.query(
    'select * from recording where channel = $1 and stop is null order by start desc',
    [channel]
  );
  if (result.rows.length === 0) {
    return undefined;
  }
  return {
    id: result.rows[0].id,
    start: result.rows[0].start,
    stop: result.rows[0].stop,
    channel: result.rows[0].channel,
    site_id: result.rows[0].site_id,
    data: result.rows[0].data,
  };
}

export async function getRecordingBySiteId(
  site_id: string
): Promise<Recording | undefined> {
  const { pool } = getP();

  const result = await pool.query(
    'SELECT * FROM recording WHERE site_id = $1',
    [site_id]
  );
  if (result.rows.length === 0) {
    return undefined;
  }
  return {
    id: result.rows[0].id,
    start: result.rows[0].start,
    stop: result.rows[0].stop,
    channel: result.rows[0].channel,
    site_id: result.rows[0].site_id,
    data: result.rows[0].data,
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

export async function addFile(
  recordingId: string,
  name: string,
  seq: number,
  offset: number,
  duration: number,
  time: Date
): Promise<void> {
  const { pool } = getP();

  await pool.query(
    'INSERT into file (recording_id,name,seq,time_offset,duration,retries,datetime,size,downloaded,hash,status) VALUES ($1,$2,$3,$4,$5,0,$6,0,0,$7,$8)',
    [recordingId, name, seq, offset, duration, time, '', 'waiting']
  );
}

export async function getLatestFile(
  recordingId: string
): Promise<File | undefined> {
  const { pool } = getP();

  const result = await pool.query(
    'select * from file where recording_id = $1 order by seq desc limit 1',
    [recordingId]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  return {
    recording_id: result.rows[0].recording_id,
    name: result.rows[0].name,
    seq: result.rows[0].seq,
    time_offset: result.rows[0].time_offset,
    duration: result.rows[0].duration,
    retries: result.rows[0].retries,
    datetime: result.rows[0].datetime,
    size: result.rows[0].size,
    downloaded: result.rows[0].downloaded,
    hash: result.rows[0].hash,
    status: result.rows[0].status,
  };
}

export async function getFileCount(
  recordingId: string,
  status?: string
): Promise<number> {
  const { pool } = getP();

  if (status === undefined) {
    const result = await pool.query(
      'select count(*) from file where recording_id = $1',
      [recordingId]
    );
    return result.rows[0][0];
  } else {
    const result = await pool.query(
      'select count(*) from file where recording_id = $1 and status = $2',
      [recordingId, status]
    );
    return result.rows[0][0];
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
    time_offset: result.rows[0].time_offset,
    duration: result.rows[0].duration,
    retries: result.rows[0].retries,
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

export async function allFilesDone(recordingId: string): Promise<boolean> {
  const { pool } = getP();

  const recording = await getRecording(recordingId);
  if (recording === undefined) {
    throw new Error('unknown recording ' + recordingId);
  }
  if (recording.stop === null) {
    return false;
  }
  const result = await pool.query(
    "select count(*) from file where recording_id = $1 and status = 'downloading' or status = 'waiting'",
    [recordingId]
  );
  return result.rows[0][0] === 0;
}
