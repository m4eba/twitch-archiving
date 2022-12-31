import { KafkaConfigOpt, RedisConfigOpt, FileConfigOpt, PostgresConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import 'hls-parser';
import { ITPlaylistUpdate, OTPlaylistUpdate, } from '@twitch-archiving/messages';
import { initLogger, fetchWithTimeoutText } from '@twitch-archiving/utils';
import { initRedis, download as dl, initPostgres, } from '@twitch-archiving/database';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: ITPlaylistUpdate },
    outputTopicPlaylistText: {
        type: String,
        defaultValue: OTPlaylistUpdate.playlistText,
    },
    outputTopicMasterPlaylistRequest: {
        type: String,
        defaultValue: OTPlaylistUpdate.masterPlaylistRequest,
    },
    redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...PlaylistConfigOpt,
    ...RedisConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('playlist-update');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initRedis(config, config.redisPrefix);
await initPostgres(config);
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'playlist-update' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        const user = message.key.toString();
        const recording = await dl.getRunningRecording(user);
        if (recording === undefined) {
            await forcePlaylistUpdate(user);
            return;
        }
        const playlist = recording.data;
        logger.debug({ playlist, user }, 'playlist');
        if (playlist === null) {
            await forcePlaylistUpdate(user);
            return;
        }
        logger.trace({ url: playlist.bestUrl, user }, 'fetch playlist');
        //const resp = await fetch(playlist.url);
        const { data, resp } = await fetchWithTimeoutText(playlist.bestUrl, 3, 2000);
        if (resp.status !== 200) {
            logger.debug({ code: resp.status }, 'invalid status code');
            await forcePlaylistUpdate(user);
            return;
        }
        logger.trace({ data }, 'playlist text');
        const msg = {
            id: recording.site_id,
            recordingId: recording.id,
            text: data,
            user,
        };
        await sendData(config.outputTopicPlaylistText, {
            key: user + '-' + recording.id,
            value: JSON.stringify(msg),
            timestamp: new Date().getTime().toString(),
        });
    },
});
async function forcePlaylistUpdate(user) {
    const req = {
        user,
    };
    await sendData(config.outputTopicMasterPlaylistRequest, {
        key: user,
        value: JSON.stringify(req),
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
