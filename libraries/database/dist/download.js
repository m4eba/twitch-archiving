import { getPool, getR, getP, getPR } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
const logger = initLogger('database-download');
const MAX_PLAYLIST_ERROR = 3;
export async function createTableDownload() {
    const pool = getPool();
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
      recording_id bigint not null,
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
export async function setPlaylistMessage(data) {
    const { redis, prefix } = getR();
    await redis.set(prefix + '-stream-' + data.user, JSON.stringify(data));
}
export async function getPlaylistMessage(user) {
    const { redis, prefix } = getR();
    const data = await redis.get(prefix + '-stream-' + user);
    if (data === null)
        return undefined;
    return JSON.parse(data);
}
export async function setPlaylistEnding(recordingId) {
    const { redis, prefix } = getR();
    await redis.hSet(prefix + recordingId + '-data', 'ending', '1');
}
export async function isPlaylistEnding(recordingId) {
    const { redis, prefix } = getR();
    return (await redis.hGet(prefix + recordingId + '-data', 'ending')) === '1';
}
export async function incPlaylistError(recordingId) {
    const { redis, prefix } = getR();
    let value = await getPlaylistError(recordingId);
    ++value;
    await redis.hSet(prefix + recordingId + '-data', 'playlistError', value);
}
export async function getPlaylistError(recordingId) {
    const { redis, prefix } = getR();
    let value = await redis.hGet(prefix + recordingId + '-data', 'playlistError');
    if (value === null || value === undefined)
        value = '0';
    return parseInt(value);
}
export async function startRecording(time, channel, site_id) {
    const { pool, redis, prefix } = getPR();
    const result = await pool.query('INSERT into recording VALUES (DEFAULT, $1, null, $2, $3) RETURNING id', [time, channel, site_id]);
    const id = result.rows[0].id;
    await redis.set(prefix + channel + '-recordingId', id);
    await redis.sAdd(prefix + '-streams', channel);
    return id;
}
export async function stopRecording(time, recordingId) {
    const { pool, redis, prefix } = getPR();
    const recording = await getRecording(recordingId);
    if (!recording)
        return;
    const channel = recording.channel;
    await pool.query('UPDATE recording SET stop=$1 WHERE  id = $2', [
        time,
        recordingId,
    ]);
    await redis.del(prefix + channel + '-recordingId');
    await redis.del(prefix + recordingId + '-data');
    await redis.del(prefix + '-stream-' + channel);
    await redis.sRem(prefix + '-streams', channel);
    await redis.del(prefix + recordingId + '-data');
    await redis.del(prefix + recordingId + '-segments-waiting');
    await redis.del(prefix + recordingId + '-segments-running');
    await redis.del(prefix + recordingId + '-segments-done');
    await redis.del(prefix + recordingId + '-segment-count');
}
export async function getRecordedChannels() {
    const { redis, prefix } = getR();
    const channels = await redis.sMembers(prefix + '-streams');
    return channels;
}
export async function isRecording(channel) {
    const { redis, prefix } = getR();
    return await redis.sIsMember(prefix + '-streams', channel);
}
export async function getRecordingId(channel) {
    const { redis, prefix } = getR();
    const id = await redis.get(prefix + channel + '-recordingId');
    if (!id)
        return '';
    return id;
}
export async function getRecording(id) {
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
export async function updateSiteId(recordingId, siteId) {
    const { pool } = getP();
    await pool.query('UPDATE recording SET site_id=$1 WHERE id = $2', [
        siteId,
        recordingId,
    ]);
}
export async function startFile(recordingId, name, seq, duration, time) {
    const { pool, redis, prefix } = getPR();
    await pool.query('INSERT into file (recording_id,name,seq,retries,duration,datetime,size,downloaded,hash,status) VALUES ($1,$2,$3,0,$4,$5,0,0,$6,$7)', [recordingId, name, seq, duration, time, '', 'downloading']);
    await redis.sAdd(prefix + recordingId + '-segments-running', seq.toString());
    await redis.sRem(prefix + recordingId + '-segments-waiting', seq.toString());
}
export async function addSegment(recordingId, sequenceNumber) {
    const { redis, prefix } = getR();
    await redis.sAdd(prefix + recordingId + '-segments-waiting', sequenceNumber.toString());
    await redis.incr(prefix + recordingId + '-segment-count');
}
export async function getSegmentCount(recordingId) {
    const { redis, prefix } = getR();
    const value = await redis.get(prefix + recordingId + '-segment-count');
    if (value === null || value === undefined)
        return 0;
    return parseInt(value);
}
export async function testSegment(recordingId, sequenceNumber) {
    const { redis, prefix } = getR();
    const wait = await redis.sIsMember(prefix + recordingId + '-segments-waiting', sequenceNumber.toString());
    if (wait)
        return true;
    const done = await redis.sIsMember(prefix + recordingId + '-segments-done', sequenceNumber.toString());
    if (done)
        return true;
    const running = await redis.sIsMember(prefix + recordingId + '-segments-running', sequenceNumber.toString());
    return running;
}
export async function finishedFile(recordingId, sequenceNumber) {
    const { redis, prefix } = getR();
    await redis.sRem(prefix + recordingId + '-segments-running', sequenceNumber.toString());
    await redis.sAdd(prefix + recordingId + '-segments-done', sequenceNumber.toString());
}
export async function isRecordingDone(recordingId) {
    const { redis, prefix } = getR();
    const wait = await redis.sMembers(prefix + recordingId + '-segments-waiting');
    const running = await redis.sMembers(prefix + recordingId + '-segments-running');
    const done = await redis.sMembers(prefix + recordingId + '-segments-done');
    logger.trace({ wait, running, done }, 'segments');
    const ending = await isPlaylistEnding(recordingId);
    const playlistError = await getPlaylistError(recordingId);
    logger.trace({ ending, playlistError }, 'meta end - playlisterror');
    return ((ending || playlistError >= MAX_PLAYLIST_ERROR) &&
        (await redis.sCard(prefix + recordingId + '-segments-running')) === 0 &&
        (await redis.sCard(prefix + recordingId + '-segments-waiting')) === 0);
}
export async function getFile(recordingId, name) {
    const { pool } = getP();
    const result = await pool.query('SELECT * FROM file WHERE recording_id = $1 AND name = $2', [recordingId, name]);
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
export async function updateFileSize(recordingId, name, size) {
    const { pool } = getP();
    await pool.query('UPDATE file SET size=$1 WHERE recording_id = $2 AND name = $3', [size, recordingId, name]);
}
export async function updateFileDownloadSize(recordingId, name, size) {
    const { pool } = getP();
    await pool.query('UPDATE file SET downloaded=$1 WHERE recording_id = $2 AND name = $3', [size, recordingId, name]);
}
export async function updateFileStatus(recordingId, name, status) {
    const { pool } = getP();
    await pool.query('UPDATE file SET status=$1 WHERE recording_id = $2 AND name = $3', [status, recordingId, name]);
}
export async function incrementFileRetries(recordingId, name) {
    const { pool } = getP();
    await pool.query('UPDATE file SET retries=retires+1 WHERE recording_id = $1 AND name = $2', [recordingId, name]);
}
