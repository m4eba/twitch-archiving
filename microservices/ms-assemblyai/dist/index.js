import fs from 'fs';
import path from 'path';
import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { execFfmpeg, initLogger } from '@twitch-archiving/utils';
import { initPostgres, initRedis, assemblyai as ai, } from '@twitch-archiving/database';
import Ffmpeg from 'fluent-ffmpeg';
import WebSocket from 'ws';
const AssemblyAiConfigOpt = {
    recordingInputTopic: { type: String, defaultValue: 'tw-recording' },
    recordingEndedInputTopic: {
        type: String,
        defaultValue: 'tw-recording-ended',
    },
    segmentsInputTopic: { type: String, defaultValue: 'tw-segment-ended' },
    outputTopic: { type: String, defaultValue: 'tw-assemblyai' },
    user: { type: String, multiple: true },
    token: { type: String },
    tmpFolder: { type: String },
    redisPrefix: { type: String, defaultValue: 'tw-assemblyai-' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...AssemblyAiConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('assemblyai');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initRedis(config, config.redisPrefix);
await initPostgres(config);
await ai.createTable();
const userSet = new Set();
config.user.forEach((u) => userSet.add(u));
const socketMap = new Map();
const sessionIdMap = new Map();
// get notified of new recordings
const consumerRecording = kafka.consumer({
    groupId: 'assemblyai-recording-start',
});
await consumerRecording.connect();
await consumerRecording.subscribe({
    topic: config.recordingInputTopic,
    fromBeginning: true,
});
await consumerRecording.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        if (!userSet.has(msg.user))
            return;
        logger.debug({ msg }, 'starting');
        const ws = openWebSocket(msg.user, msg.recordingId);
        socketMap.set(msg.user + '-' + msg.recordingId, ws);
        sessionIdMap.set(msg.user + '-' + msg.recordingId, '');
        await fs.promises.mkdir(path.join(config.tmpFolder, msg.user, msg.recordingId), { recursive: true });
    },
});
// mark segments for screenshots
const consumerSegments = kafka.consumer({
    groupId: 'assemblyai-segments',
});
await consumerSegments.connect();
await consumerSegments.subscribe({
    topic: config.segmentsInputTopic,
    fromBeginning: true,
});
const producer = kafka.producer();
await producer.connect();
await consumerSegments.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        logger.trace({ user: message.key, msg }, 'playlistSegmentMessage');
        if (!userSet.has(msg.user))
            return;
        const tmpOutput = path.join(config.tmpFolder, msg.user, msg.recordingId);
        const command = Ffmpeg()
            .input(path.join(msg.path))
            .outputOptions('-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1', '-af', 'aresample=async=1000', '-f', 'segment', '-segment_time', '1.2')
            .output(path.join(tmpOutput, 'out%03d.wav'));
        await execFfmpeg(command);
        const waves = await fs.promises.readdir(tmpOutput);
        logger.trace({ files: waves }, 'wav files');
        for (let ii = 0; ii < waves.length; ++ii) {
            const name = path.join(tmpOutput, waves[ii]);
            const content = await fs.promises.readFile(name);
            const data = Buffer.from(content).toString('base64');
            logger.trace({ name, size: data.length }, 'sending file');
            const ws = await socketReady(msg.user, msg.recordingId);
            ws.send(JSON.stringify({
                audio_data: data,
            }));
            await fs.promises.rm(name);
        }
    },
});
// clean up after recording is done
const consumerRecordingEnded = kafka.consumer({
    groupId: 'assemblyai-recording-end',
});
await consumerRecordingEnded.connect();
await consumerRecordingEnded.subscribe({
    topic: config.recordingEndedInputTopic,
    fromBeginning: true,
});
await consumerRecordingEnded.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        if (!userSet.has(msg.user))
            return;
        logger.debug({ msg }, 'recording end message');
    },
});
async function socketReady(user, recordingId) {
    let socket = socketMap.get(user + '-' + recordingId);
    if (socket !== undefined && socket.readyState === WebSocket.OPEN)
        return socket;
    return new Promise((resolve, reject) => {
        /*if (tries === 5) {
          reject('max tries reached');
          return;
        }*/
        if (socket !== undefined && socket.readyState !== WebSocket.CONNECTING) {
            socket.onclose = () => {
                //tries++;
                resolve(socketReady(user, recordingId));
            };
            return;
        }
        let initNew = true;
        if (socket !== undefined && socket.readyState === WebSocket.CONNECTING) {
            initNew = false;
        }
        if (initNew || socket === undefined) {
            socket = openWebSocket('', '');
            socketMap.set(user + '-' + recordingId, socket);
        }
        socket.onopen = () => {
            console.log('connected');
            if (socket !== undefined) {
                resolve(socket);
            }
            else {
                reject();
            }
        };
    });
}
function openWebSocket(user, recordingId) {
    const session_id = sessionIdMap.get(user + '-' + recordingId);
    let url = 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000';
    if (session_id !== undefined && session_id.length > 0) {
        url = 'wss://api.assemblyai.com/v2/realtime/ws/' + session_id;
    }
    logger.debug({ user, recordingId, url }, 'connection websocket');
    const ws = new WebSocket(url, undefined, {
        headers: {
            authorization: config.token,
        },
    });
    ws.onmessage = async (message) => {
        //const res = JSON.parse(message.data);
        //console.log(message.data);
        const msg = JSON.parse(message.data.toString());
        logger.trace({ msg }, 'onmessage');
        if (msg.message_type === 'SessionBegins') {
            sessionIdMap.set(user + '-' + recordingId, msg.session_id);
        }
        if (msg.message_type === 'FinalTranscript') {
            const t = msg;
            t.recording_id = recordingId;
            t.created = new Date(msg.created);
            t.transcript = msg.text;
            t.audio_start = msg.audio_start;
            t.audio_end = msg.audio_end;
            t.confidence = msg.confidence;
            t.words = msg.words;
            await ai.insertTranscript(t);
        }
    };
    ws.onerror = (e) => {
        console.log('error', e);
        ws.close();
    };
    ws.onclose = () => {
        socketMap.delete(user + '-' + recordingId);
    };
    return ws;
}
