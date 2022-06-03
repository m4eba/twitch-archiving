import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import HLS from 'hls-parser';
import { createClient } from 'redis';
import { getLivePlaylist, getAccessToken, } from '@twitch-archiving/twitch';
import { PlaylistType, } from '@twitch-archiving/messages';
import { initPostgres, initRedis, download as dl, } from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-live' },
    playlistOutputTopic: { type: String, defaultValue: 'tw-playlist' },
    recordingOutputTopic: { type: String, defaultValue: 'tw-recording' },
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
await initPostgres(config);
await initRedis(config, config.redisPrefix);
await dl.createTableDownload();
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
        logger.debug({ user }, 'received msg');
        let init = false;
        let newStream = false;
        if (message.value) {
            const event = JSON.parse(message.value.toString());
            logger.trace({ event }, 'message event');
            if (event.forceReload !== undefined && event.forceReload === true) {
                logger.debug('forceReload message', { user, msg: event });
                init = true;
            }
            if (event.data !== undefined &&
                event.data.topic !== undefined &&
                event.data.message !== undefined &&
                event.data.topic.toString().startsWith('video-playback-by-id')) {
                const msg = JSON.parse(event.data.message);
                if (msg.type !== undefined && msg.type === 'stream-up') {
                    logger.debug('stream-up msesage', { user, msg: event });
                    init = true;
                    newStream = true;
                }
            }
        }
        if (!(await dl.isRecording(user))) {
            logger.debug('member not in redis', { user });
            init = true;
        }
        if (init) {
            await initStream(user, newStream);
        }
    },
});
async function initStream(user, newStream) {
    const token = await getAccessToken({
        isLive: true,
        isVod: false,
        login: user,
        playerType: '',
        vodID: '',
    }, config.oauthVideo);
    logger.trace({ user, token }, 'access token');
    const playlist = await getLivePlaylist(user, token);
    if (playlist.length === 0) {
        return;
    }
    logger.trace({ user, playlist }, 'playlist');
    const playlistMessage = await dl.getPlaylistMessage(user);
    const reg = /BROADCAST-ID="(.*?)"/;
    let id = '';
    const regResult = reg.exec(playlist);
    if (regResult) {
        id = regResult[1].toString();
        logger.debug({ user, id }, 'broadcast-id in playlist');
    }
    else {
        // id is empty - twitch changed something
        // look for id in playlistmessage
        if (playlistMessage === undefined || newStream) {
            id = user + '-' + new Date().toISOString();
        }
        else {
            id = playlistMessage.id;
        }
        logger.debug({ user, id }, 'set id from date');
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
        recordingId: '',
        type: PlaylistType.LIVE,
        playlist,
        token,
        url: best.uri,
    };
    let recordingId = '';
    const site_id = 'live-' + id;
    logger.trace({ user, id, site_id }, 'site_id');
    if (playlistMessage !== undefined && newStream) {
        recordingId = playlistMessage.recordingId;
        if (recordingId.length !== 0) {
            logger.debug({ recordingId, user }, 'stop running recording');
            await dl.stopRecording(new Date(), recordingId);
        }
    }
    if (playlistMessage === undefined || newStream) {
        logger.debug({ data, user }, 'start new recording');
        recordingId = await dl.startRecording(new Date(), user, site_id);
        data.recordingId = recordingId;
        const recMsg = {
            user,
            id,
            recordingId,
            type: data.type,
        };
        await sendData(config.recordingOutputTopic, {
            key: user,
            value: JSON.stringify(recMsg),
            timestamp: new Date().getTime().toString(),
        });
    }
    await dl.setPlaylistMessage(data);
    logger.debug('playlist', { user, playlistMessage: data });
    const msg = JSON.stringify(data);
    await sendData(config.playlistOutputTopic, {
        key: user,
        value: msg,
        timestamp: new Date().getTime().toString(),
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
