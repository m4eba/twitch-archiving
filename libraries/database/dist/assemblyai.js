import { initLogger } from '@twitch-archiving/utils';
import { getR, getP } from './init.js';
const logger = initLogger('database-assemblyai');
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
      audio_start integer not null,
      audio_end integer not null,
      confidence real not null,
      created timestamptz not null,
      words json not null
    );
    
    create index transcribe_recording_id_idx on transcript (recording_id);
    create index transcribe_audio_start_idx on transcript (audio_start);
    create index transcribe_audio_end_idx on transcript (audio_end);

    `);
    }
}
export async function insertTranscript(transcript) {
    const { pool } = getP();
    const result = await pool.query('INSERT INTO transcript VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7 ) RETURNING id', [
        transcript.recording_id,
        transcript.transcript,
        transcript.audio_start,
        transcript.audio_end,
        transcript.confidence,
        transcript.created,
        JSON.stringify(transcript.words),
    ]);
    const id = result.rows[0].id;
    return id;
}
export async function markStarted(recordingId) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId }, 'markStarted');
    await redis.set(prefix + 'started-' + recordingId, '1');
}
export async function unmarkStarted(recordingId) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId }, 'unmarkStarted');
    await redis.del(prefix + 'started-' + recordingId);
}