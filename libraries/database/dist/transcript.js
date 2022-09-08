import { initLogger } from '@twitch-archiving/utils';
import { getP } from './init.js';
const logger = initLogger('database-transcript');
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
      words jsonb not null
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
