import type { Logger } from 'pino';
import { getP, getR } from './init.js';
import { initLogger } from '@twitch-archiving/utils';
import type { ScreenshotDoneMessage } from '@twitch-archiving/messages';

const logger: Logger = initLogger('database-storyboard');

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
      id bigserial primary key,
      recording_id bigint not null,
      offset integer not null,
      interval smallint not null,
      slug text not null,
    );

    create index storyboard_recording_id_idx on storyboard(recording_id);
    create index storyboard_offset_idx on storyboard(offset);
    create index storyboard_slug_idx on storyboard(slug);
      `);
  }
}

export async function screenshotReady(
  recordingId: string,
  sbIndex: number,
  data: ScreenshotDoneMessage
): Promise<ScreenshotDoneMessage[]> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId, sbIndex, data }, 'screenshotReady');

  const name = prefix + recordingId + sbIndex.toString();
  await redis.lPush(name, JSON.stringify(data));
  const list = await redis.lRange(name, 0, -1);
  const result = list.map((l) => JSON.parse(l));

  logger.trace({ recordingId, sbIndex, result }, 'screenshotReady result');
  return result;
}
