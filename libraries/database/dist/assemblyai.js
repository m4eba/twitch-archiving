import { initLogger } from '@twitch-archiving/utils';
import { getR, getP } from './init.js';
const logger = initLogger('database-assemblyai');
const SEGMENTS = (prefix, recordingId) => {
    return `${prefix}-${recordingId}-segments`;
};
const END_TIME = (prefix, recordingId) => {
    return `${prefix}-${recordingId}-end-time`;
};
export async function createTable() {
    const { pool } = getP();
    // test for tables
    const tabletest = await pool.query(`SELECT EXISTS (
  SELECT FROM pg_tables
  WHERE  schemaname = 'public'
  AND    tablename  = 'transcript'
  );`);
    if (!tabletest.rows[0].exists) {
        await pool.query(`
    create table transcript (
      id BIGSERIAL primary key,
      recording_id bigint not null,
      transcript text not null,
      total_start integer not null,
      total_end integer not null,
      segment_sequence integer not null,
      audio_start integer not null,
      audio_end integer not null,
      confidence real not null,
      created timestamptz not null,
      words json not null
    );
    
    create index transcribe_recording_id_idx on transcript (recording_id);
    create index transcribe_total_start_idx on transcript (total_start);
    create index transcribe_total_end_idx on transcript (total_end);

    `);
    }
}
export async function insertTranscript(transcript) {
    const { pool } = getP();
    const result = await pool.query(`INSERT INTO transcript 
    (id, recording_id, transcript, total_start, total_end, 
      segment_sequence, audio_start, audio_end, confidence, 
      created,words) 
      VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING id`, [
        transcript.recording_id,
        transcript.transcript,
        transcript.total_start,
        transcript.total_end,
        transcript.segment_sequence,
        transcript.audio_start,
        transcript.audio_end,
        transcript.confidence,
        transcript.created,
        JSON.stringify(transcript.words),
    ]);
    const id = result.rows[0].id;
    return id;
}
export async function addSegment(msg) {
    const { redis, prefix } = getR();
    await redis.lPush(SEGMENTS(prefix, msg.recordingId), JSON.stringify(msg));
}
export async function getSegments(recordingId) {
    const { redis, prefix } = getR();
    const data = await redis.lRange(SEGMENTS(prefix, recordingId), 0, -1);
    return data.map((s) => JSON.parse(s));
}
export async function setEndTime(recordingId, time) {
    const { redis, prefix } = getR();
    await redis.set(END_TIME(prefix, recordingId), time.toString());
}
export async function getEndTime(recordingId) {
    const { redis, prefix } = getR();
    const data = await redis.get(END_TIME(prefix, recordingId));
    if (data === undefined || data === null) {
        return 0;
    }
    return parseInt(data);
}
export async function clear(recordingId) {
    const { redis, prefix } = getR();
    await redis.del(END_TIME(prefix, recordingId));
    await redis.del(SEGMENTS(prefix, recordingId));
}
