import type { Logger } from 'pino';
import { initLogger } from '@twitch-archiving/utils';
import { getR } from './init.js';
import type { ScreenshotMessage } from '@twitch-archiving/messages';

const logger: Logger = initLogger('database-screenshot');

export interface ScreenshotData {
  sequence: number;
  index: number;
  offset: number;
}

export interface Request {
  msg: ScreenshotMessage;
  filename: string;
}

export async function markStarted(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId }, 'markStarted');
  await redis.set(prefix + 'started-' + recordingId, '1');
}

export async function unmarkStarted(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId }, 'unmarkStarted');
  await redis.del(prefix + 'started-' + recordingId);
}

export async function hasStarted(recordingId: string): Promise<boolean> {
  const { redis, prefix } = getR();
  const started = await redis.get(prefix + 'started-' + recordingId);
  return started === '1';
}

export async function setData(
  recordingId: string,
  data: ScreenshotData
): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId, data }, 'setData');
  await redis.set(prefix + 'data-' + recordingId, JSON.stringify(data));
}

export async function getData(
  recordingId: string
): Promise<ScreenshotData | undefined> {
  const { redis, prefix } = getR();
  const data = await redis.get(prefix + 'data-' + recordingId);
  if (data === null) return undefined;
  return JSON.parse(data) as ScreenshotData;
}

export async function endRecording(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId }, 'endRecording');
  await redis.set(prefix + 'ended-' + recordingId, '1');
}

export async function setRequest(
  recordingId: string,
  data: ScreenshotData
): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId, data }, 'setRequest');
  await redis.hSet(
    prefix + 'request-' + recordingId,
    data.sequence.toString(),
    JSON.stringify(data)
  );
}

export async function getRequest(
  recordingId: string,
  sequence: number
): Promise<ScreenshotData | undefined> {
  const { redis, prefix } = getR();
  const data = await redis.hGet(
    prefix + 'request-' + recordingId,
    sequence.toString()
  );
  logger.trace({ data }, 'getRequest');
  if (data === undefined) return undefined;
  // seems hGet returns null but the ts file says undefined???
  if (data === null) return undefined;
  return JSON.parse(data);
}

export async function rmRequest(
  recordingId: string,
  sequence: number
): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId, sequence }, 'rmRequest');
  await redis.hDel(prefix + 'request-' + recordingId, sequence.toString());
}

export async function isRecordingDone(recordingId: string): Promise<boolean> {
  const { redis, prefix } = getR();
  return (
    (await redis.get(prefix + 'ended-' + recordingId)) === '1' &&
    (await redis.hLen(prefix + 'request-' + recordingId)) === 0
  );
}

export async function clear(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId }, 'clear');
  await redis.del(prefix + 'data-' + recordingId);
  await redis.get(prefix + 'started-' + recordingId);
  await redis.del(prefix + 'ended-' + recordingId);
  await redis.del(prefix + 'request-' + recordingId);
}
