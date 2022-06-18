import { initLogger } from '@twitch-archiving/utils';
import { getR } from './init.js';
const logger = initLogger('database-screenshot');
const SCREENSHOT_CLEAR = (prefix, recordingId, index) => {
    return `${prefix}-screenshot-clear-${recordingId}-${index.toString()}`;
};
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
export async function hasStarted(recordingId) {
    const { redis, prefix } = getR();
    const started = await redis.get(prefix + 'started-' + recordingId);
    return started === '1';
}
export async function setData(recordingId, data) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId, data }, 'setData');
    await redis.set(prefix + 'data-' + recordingId, JSON.stringify(data));
}
export async function getData(recordingId) {
    const { redis, prefix } = getR();
    const data = await redis.get(prefix + 'data-' + recordingId);
    if (data === null)
        return undefined;
    return JSON.parse(data);
}
export async function endRecording(recordingId, segmentCount) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId }, 'endRecording');
    await redis.set(prefix + 'ended-' + recordingId, segmentCount.toString());
}
export async function getTotalSegmentCount(recordingId) {
    const { redis, prefix } = getR();
    const value = await redis.get(prefix + 'ended-' + recordingId);
    logger.trace({ recordingId, value }, 'getTotalSegmentCount');
    if (value === null || value === undefined) {
        return undefined;
    }
    return parseInt(value);
}
export async function incSegments(recordingId) {
    const { redis, prefix } = getR();
    await redis.incr(prefix + recordingId + '-segment-count');
}
export async function setRequest(recordingId, data) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId, data }, 'setRequest');
    await redis.hSet(prefix + 'request-' + recordingId, data.sequence.toString(), JSON.stringify(data));
}
export async function getRequest(recordingId, sequence) {
    const { redis, prefix } = getR();
    const data = await redis.hGet(prefix + 'request-' + recordingId, sequence.toString());
    logger.trace({ data }, 'getRequest');
    if (data === undefined)
        return undefined;
    // seems hGet returns null but the ts file says undefined???
    if (data === null)
        return undefined;
    return JSON.parse(data);
}
export async function rmRequest(recordingId, sequence) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId, sequence }, 'rmRequest');
    await redis.hDel(prefix + 'request-' + recordingId, sequence.toString());
}
export async function incRequests(recordingId) {
    const { redis, prefix } = getR();
    await redis.incr(prefix + recordingId + '-request-count');
}
export async function isRecordingInitDone(recordingId) {
    const { redis, prefix } = getR();
    const total = await redis.get(prefix + 'ended-' + recordingId);
    logger.trace({ recordingId, total }, 'total isRecordingInitDone');
    if (total === null || total === undefined)
        return false;
    const current = await redis.get(prefix + recordingId + '-segment-count');
    logger.trace({ current }, 'current isRecordingInitDone');
    return total === current;
}
export async function clearInit(recordingId) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId }, 'clear');
    await redis.del(prefix + 'data-' + recordingId);
    await redis.get(prefix + 'started-' + recordingId);
    await redis.del(prefix + recordingId + '-segment-count');
}
export async function clearAll(recordingId) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId }, 'clear all');
    await redis.del(prefix + recordingId + '-request-count');
    await redis.del(prefix + 'request-' + recordingId);
    await redis.del(prefix + 'ended-' + recordingId);
}
