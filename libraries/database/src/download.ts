import type { Pool } from 'pg';
import { getPool } from './init.js';

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
      id SERIAL primary key,
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
      id SERIAL primary key,
      recording_id integer not null,
      name text not null,
      seq integer not null,          
      duration decimal not null,
      datetime timestamptz not null,
      size integer not null,
      downloaded integer not null,
      hash text not null,
      status file_status
    );

    create index file_recording_id_idx on file(recording_id);
    create index file_name_idx on file (name);
    create index file_seq_idx on file (seq);
    create index file_status on file (status);
    `);
  }
}

export async function startRecording(
  time: Date,
  channel: string,
  site_id: string
): Promise<number> {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  const result = await pool.query(
    'INSERT into recording VALUES (DEFAULT, $1, null, $2, $3) RETURNING id',
    [time, channel, site_id]
  );
  return result.rows[0].id;
}

export async function stopRecording(
  time: Date,
  recordingId: number
): Promise<void> {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  await pool.query('UPDATE recording SET stop=$1 WHERE  id = $2', [
    time,
    recordingId,
  ]);
}

export async function updateSiteId(
  recordingId: number,
  siteId: string
): Promise<void> {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  await pool.query('UPDATE recording SET site_id=$1 WHERE id = $2', [
    siteId,
    recordingId,
  ]);
}

export async function startFile(
  recordingId: number,
  name: string,
  seq: number,
  duration: number,
  time: Date
): Promise<number> {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  const result = await pool.query(
    'INSERT into file (recording_id,name,seq,duration,datetime,size,downloaded,hash,status) VALUES ($1,$2,$3,$4,$5,0,0,$6,$7) RETURNING id',
    [recordingId, name, seq, duration, time, '', 'downloading']
  );
  return result.rows[0].id;
}

export async function updateFileSize(
  recordingId: number,
  name: string,
  size: number
): Promise<void> {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  await pool.query(
    'UPDATE file SET size=$1 WHERE recording_id = $2 AND name = $3',
    [size, recordingId, name]
  );
}

export async function updateFileDownloadSize(
  recordingId: number,
  name: string,
  size: number
): Promise<void> {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  await pool.query(
    'UPDATE file SET downloaded=$1 WHERE recording_id = $2 AND name = $3',
    [size, recordingId, name]
  );
}

export async function updateFileStatus(
  recordingId: number,
  name: string,
  status: string
): Promise<void> {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  await pool.query(
    'UPDATE file SET status=$1 WHERE recording_id = $2 AND name = $3',
    [status, recordingId, name]
  );
}
