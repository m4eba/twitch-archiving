import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import HLS from 'hls-parser';
import '@twitch-archiving/twitch';
import { PlaylistType, RecordingMessageType, PlaylistMessageType, ITPlaylistParseMaster, OTPlaylistParseMaster, MasterPlaylistSourceType, } from '@twitch-archiving/messages';
import { initPostgres, initRedis, download as dl, } from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';
const PlaylistConfigOpt = {
    inputTopic: { type: String, defaultValue: ITPlaylistParseMaster },
    outputTopicPlaylistUpdate: {
        type: String,
        defaultValue: OTPlaylistParseMaster.playlistUpdate,
    },
    outputTopicPlaylist: {
        type: String,
        defaultValue: OTPlaylistParseMaster.playlist,
    },
    outputTopicRecording: {
        type: String,
        defaultValue: OTPlaylistParseMaster.recording,
    },
    outputTopicMasterPlaylistRequest: {
        type: String,
        defaultValue: OTPlaylistParseMaster.masterPlaylistRequest,
    },
    oauthVideo: { type: String, defaultValue: '' },
    redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
    redisSetName: { type: String, defaultValue: 'tw-playlist-live' },
    playlistMaxRetries: { type: Number, defaultValue: 30 },
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
const logger = initLogger('paylist-parse-master');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initPostgres(config);
await initRedis(config, config.redisPrefix);
await dl.createTableDownload();
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({ groupId: 'paylist-parse-master' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const user = message.key.toString();
        const data = JSON.parse(message.value.toString());
        logger.debug({ user, data }, 'received msg');
        await initStream(data);
    },
});
async function initStream(msg) {
    const playlist = msg.text;
    const user = msg.user;
    let recording = msg.id.length > 0 ? await dl.getRecording(msg.id) : undefined;
    const newStream = msg.source === MasterPlaylistSourceType.STREAM_UP_EVENT;
    // TODO
    // better handling if BROADCAST-ID is not set
    const reg = /BROADCAST-ID="(.*?)"/;
    let site_id = '';
    const regResult = reg.exec(playlist);
    if (regResult) {
        const streamId = regResult[1].toString();
        site_id = 'live-' + streamId;
        logger.debug({ user, site_id }, 'site_id in playlist');
        if (recording !== undefined) {
            if ('live-' + streamId !== recording.site_id) {
                await dl.stopRecording(new Date(), recording.id);
                recording = await dl.getRecordingBySiteId('live-' + streamId);
            }
        }
        else {
            recording = await dl.getRecordingBySiteId('live-' + streamId);
            if (recording !== undefined && recording.stop !== null) {
                await dl.resumeRecording(recording.id);
            }
        }
    }
    else {
        // id is empty - twitch changed something
        // look for id in playlistmessage
        if (recording === undefined || newStream) {
            site_id = user + '-' + new Date().toISOString();
        }
        else {
            site_id = recording.site_id;
        }
        logger.debug({ user, site_id }, 'set id from date');
    }
    const list = HLS.parse(playlist);
    const best = list.variants.reduce((prev, curr) => {
        let result = prev;
        if (prev.bandwidth < curr.bandwidth) {
            result = curr;
        }
        logger.debug({ user, url: result }, 'best format');
        return result;
    });
    const token = msg.token
        ? msg.token
        : {
            token: '',
            sig: '',
            expires_at: '',
        };
    const data = {
        user,
        id: site_id,
        recordingId: '',
        type: PlaylistType.LIVE,
        playlist,
        token,
        url: best.uri,
    };
    const recordingData = {
        type: PlaylistType.LIVE,
        playlist,
        token,
        bestUrl: best.uri,
    };
    // do nothing if recording continues
    if (recording === undefined) {
        logger.debug({ data, user }, 'start new recording');
        const recordingId = await dl.startRecording(new Date(), user, site_id, recordingData);
        data.recordingId = recordingId;
        const recMsg = {
            type: RecordingMessageType.STARTED,
            user,
            id: site_id,
            recordingId,
            playlistType: data.type,
        };
        await sendData(config.outputTopicRecording, {
            key: user,
            value: JSON.stringify(recMsg),
            timestamp: new Date().getTime().toString(),
        });
        const plMsg = {
            type: PlaylistMessageType.START,
            user,
            id: site_id,
            recordingId,
        };
        await sendData(config.outputTopicPlaylist, {
            key: user,
            value: JSON.stringify(plMsg),
            timestamp: new Date().getTime().toString(),
        });
        // new recording from extern instance
        // force an update on the master playlist
        if (data.token === undefined) {
            const req = {
                user,
            };
            await sendData(config.outputTopicMasterPlaylistRequest, {
                key: user,
                value: JSON.stringify(req),
                timestamp: new Date().getTime().toString(),
            });
        }
    }
    else {
        // don't update if it is from extern instance
        if (data.token !== undefined) {
            await dl.updateRecordingData(recording.id, recordingData);
        }
    }
    logger.debug({ user, playlistMessage: data }, 'playlist');
    // since the url is not saved no point in forcing an update
    if (data.token !== undefined) {
        const update = JSON.stringify(data);
        await sendData(config.outputTopicPlaylistUpdate, {
            key: user,
            value: update,
            timestamp: new Date().getTime().toString(),
        });
    }
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
