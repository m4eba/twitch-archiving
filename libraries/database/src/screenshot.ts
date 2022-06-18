import type { Logger } from 'pino';
import { initLogger } from '@twitch-archiving/utils';
import { getR } from './init.js';
import type { ScreenshotMessage } from '@twitch-archiving/messages';

const logger: Logger = initLogger('database-screenshot');

const SCREENSHOT_CLEAR = (
  prefix: string,
  recordingId: string,
  index: number
): string => {
  return `${prefix}-screenshot-clear-${recordingId}-${index.toString()}`;
};
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

export async function endRecording(
  recordingId: string,
  segmentCount: number
): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId }, 'endRecording');
  await redis.set(prefix + 'ended-' + recordingId, segmentCount.toString());
}

export async function getTotalSegmentCount(
  recordingId: string
): Promise<number | undefined> {
  const { redis, prefix } = getR();

  const value = await redis.get(prefix + 'ended-' + recordingId);
  logger.trace({ recordingId, value }, 'getTotalSegmentCount');
  if (value === null || value === undefined) {
    return undefined;
  }
  return parseInt(value);
}

export async function incSegments(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  await redis.incr(prefix + recordingId + '-segment-count');
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

export async function incRequests(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  await redis.incr(prefix + recordingId + '-request-count');
}

export async function isRecordingInitDone(
  recordingId: string
): Promise<boolean> {
  const { redis, prefix } = getR();

  const total = await redis.get(prefix + 'ended-' + recordingId);
  logger.trace({ recordingId, total }, 'total isRecordingInitDone');
  if (total === null || total === undefined) return false;
  const current = await redis.get(prefix + recordingId + '-segment-count');
  logger.trace({ current }, 'current isRecordingInitDone');
  return total === current;
}

export async function clearInit(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId }, 'clear');
  await redis.del(prefix + 'data-' + recordingId);
  await redis.get(prefix + 'started-' + recordingId);
  await redis.del(prefix + recordingId + '-segment-count');
}

export async function clearAll(recordingId: string): Promise<void> {
  const { redis, prefix } = getR();
  logger.trace({ recordingId }, 'clear all');
  await redis.del(prefix + recordingId + '-request-count');
  await redis.del(prefix + 'request-' + recordingId);
  await redis.del(prefix + 'ended-' + recordingId);
}
