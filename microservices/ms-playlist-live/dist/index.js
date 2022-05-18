import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import HLS from 'hls-parser';
import { createClient } from 'redis';
import { getLivePlaylist, getAccessToken, } from '@twitch-archiving/twitch';
import { PlaylistType } from '@twitch-archiving/messages';
import { init, startRecording } from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-pubsub-events' },
    outputTopic: { type: String, defaultValue: 'tw-playlist' },
    oauthVideo: { type: String, defaultValue: '' },
    redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
    redisSetName: { type: String, defaultValue: 'tw-playlist-live' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PlaylistConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('paylist-live');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
const redis = createClient({
    url: config.redisUrl,
});
await init(config);
await redis.connect();
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'paylist-live' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        const user = message.key.toString();
        let init = false;
        if (message.value) {
            const event = JSON.parse(message.value.toString());
            if (event.forceReload !== undefined && event.forceReload === true)
                logger.debug('forceReload message', { user, msg: event });
            init = true;
            if (event.topic !== undefined &&
                event.message !== undefined &&
                event.topic.toString().startsWith('video-playback-by-id')) {
                const msg = JSON.parse(event.message);
                if (msg.type !== undefined && msg.type === 'stream-up') {
                    logger.debug('stream-up msesage', { user, msg: event });
                    init = true;
                }
            }
        }
        if (!(await redis.sIsMember(config.redisSetName, user))) {
            logger.debug('member not in redis', { user });
            init = true;
        }
        if (init) {
            await initStream(user);
        }
    },
});
async function initStream(user) {
    const token = await getAccessToken({
        isLive: true,
        isVod: false,
        login: user,
        playerType: '',
        vodID: '',
    }, config.oauthVideo);
    const playlist = await getLivePlaylist(user, token);
    const reg = /BROADCAST-ID="(.*?)"/;
    let id = '';
    const regResult = reg.exec(playlist);
    if (regResult) {
        id = regResult[1].toString();
    }
    else {
        id = user + '-' + new Date().toISOString();
    }
    const list = HLS.parse(playlist);
    const best = list.variants.reduce((prev, curr) => {
        let result = prev;
        if (prev.bandwidth < curr.bandwidth) {
            result = curr;
        }
        logger.debug('best format', { user, url: result });
        return result;
    });
    const data = {
        user,
        id,
        type: PlaylistType.LIVE,
        playlist,
        token,
        url: best.uri,
    };
    logger.debug('playlist', { user, playlistMessage: data });
    const msg = JSON.stringify(data);
    const recordingId = await startRecording(new Date(), user, 'live-' + id);
    await redis.set(config.redisPrefix + user, msg);
    await redis.set(config.redisPrefix + user + '-recordingId', recordingId);
    await redis.sAdd(config.redisSetName, user);
    await sendData(config.outputTopic, {
        key: user,
        value: msg,
        timestamp: new Date().toString(),
    });
}
async function sendData(topic, msg) {
    const messages = [];
    const topicMessage = {
        topic,
        messages: [msg],
    };
    messages.push(topicMessage);
    logger.debug({ topic: topic, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
}
