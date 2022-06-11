import { initLogger } from '@twitch-archiving/utils';
import { getR } from './init.js';
const logger = initLogger('database-screenshot');
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
export async function endRecording(recordingId) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId }, 'endRecording');
    await redis.set(prefix + 'ended-' + recordingId, '1');
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
export async function isRecordingDone(recordingId) {
    const { redis, prefix } = getR();
    return ((await redis.get(prefix + 'ended-' + recordingId)) === '1' &&
        (await redis.hLen(prefix + 'request-' + recordingId)) === 0);
}
export async function clear(recordingId) {
    const { redis, prefix } = getR();
    logger.trace({ recordingId }, 'clear');
    await redis.del(prefix + 'data-' + recordingId);
    await redis.get(prefix + 'started-' + recordingId);
    await redis.del(prefix + 'ended-' + recordingId);
    await redis.del(prefix + 'request-' + recordingId);
}
