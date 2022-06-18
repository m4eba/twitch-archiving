import { initLogger } from '@twitch-archiving/utils';
import { getR } from './init.js';
const logger = initLogger('database-assemblyai');
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
