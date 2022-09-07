import fs from 'fs';
import path from 'path';
import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { execFfmpeg, initLogger } from '@twitch-archiving/utils';
import { PlaylistMessageType, } from '@twitch-archiving/messages';
import { initPostgres, initRedis, assemblyai as ai, } from '@twitch-archiving/database';
import Ffmpeg from 'fluent-ffmpeg';
import WebSocket from 'ws';
import WebSocketAsPromised from 'websocket-as-promised';
const AssemblyAiConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-playlist' },
    outputTopic: { type: String, defaultValue: 'tw-assemblyai' },
    user: { type: String, multiple: true },
    token: { type: String },
    sessionLength: { type: Number, defaultValue: 5 * 60 },
    tmpFolder: { type: String },
    saveSessionFolder: { type: String, defaultValue: '' },
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
const consumer = kafka.consumer({
    groupId: 'assemblyai-segments',
});
await consumer.connect();
await consumer.subscribe({
    topic: config.inputTopic,
    fromBeginning: true,
});
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const m = JSON.parse(message.value.toString());
        if (m.type === PlaylistMessageType.END) {
            const socketData = socketMap.get(m.user + '-' + m.recordingId);
            if (socketData !== undefined) {
                const socket = socketData.socket;
                if (socket !== undefined && socket.isOpened) {
                    socket.sendPacked({
                        terminate_session: true,
                    });
                    socketData.terminated = true;
                }
            }
            logger.debug({ m }, 'recording end message');
            await ai.clear(m.recordingId);
            return;
        }
        if (m.type === PlaylistMessageType.START) {
            // nothing todo
            return;
        }
        const msg = m;
        logger.trace({ user: message.key, msg }, 'playlistSegmentMessage');
        if (!userSet.has(msg.user))
            return;
        const tmpOutput = path.join(config.tmpFolder, msg.user, msg.recordingId);
        await fs.promises.mkdir(tmpOutput, { recursive: true });
        const socketData = await socketReady(msg.user, msg.recordingId, tmpOutput);
        logger.trace({ recordingId: msg.recordingId }, 'websocket ready');
        if (socketData.firstSegment === undefined) {
            socketData.firstSegment = msg;
        }
        await sendSegment(socketData, msg, 0, tmpOutput);
        await ai.addSegment(msg);
    },
});
async function socketReady(user, recordingId, tmpOutput) {
    let sessionCount = 0;
    let audioShort = false;
    let socketData = socketMap.get(user + '-' + recordingId);
    let socket = undefined;
    if (socketData !== undefined) {
        audioShort = socketData.audioShort;
        sessionCount = socketData.session.count;
        if (socketData.start < Date.now() - config.sessionLength * 1000) {
            logger.debug({ recordingId, start: socketData.start }, 'start new session');
            socketData.socket.close();
        }
        else {
            socket = socketData.socket;
        }
    }
    if (socketData !== undefined && socket !== undefined) {
        if (socket.isOpened) {
            return socketData;
        }
        logger.debug({ recordingId }, 'socket not open');
    }
    socket = createWebSocket('');
    socket.onError.addListener((e) => {
        logger.error({ recordingId, error: e }, 'websocket error');
        if (socket !== undefined) {
            socket.close();
        }
    });
    socket.onClose.addListener(() => {
        logger.debug({ recordingId }, 'websocket closed');
    });
    await socket.open();
    const msg = await socket.waitUnpackedMessage((data) => data !== undefined && data.session_id !== undefined);
    socketData = {
        socket,
        start: Date.now(),
        session: {
            count: sessionCount + 1,
            waves: 0,
            transcripts: 0,
        },
        terminated: false,
        firstSegment: undefined,
        segmentOffset: 0,
        audioShort: false,
    };
    socketMap.set(user + '-' + recordingId, socketData);
    logger.trace({ recordingId, msg }, 'session started');
    socket.onUnpackedMessage.addListener(async (msg) => {
        logger.trace({ msg }, 'websocket onMessage');
        const data = socketMap.get(user + '-' + recordingId);
        //"error":"Audio duration is too short"
        if (msg.error && msg.error === 'Audio duration is too short') {
            if (data)
                data.audioShort = true;
        }
        let segment_sequence = 0;
        let total_start = 0;
        if (data !== undefined && data.firstSegment !== undefined) {
            segment_sequence = data.firstSegment.sequenceNumber;
            total_start = data.firstSegment.offset * 1000 + data.segmentOffset;
            total_start += msg.audio_start;
            total_start = Math.round(total_start);
        }
        let total_end = total_start + (msg.audio_end - msg.audio_start);
        if (msg.message_type === 'FinalTranscript') {
            const t = {
                id: '0',
                recording_id: recordingId,
                created: new Date(msg.created),
                transcript: msg.text,
                total_start,
                total_end,
                segment_sequence,
                audio_start: msg.audio_start,
                audio_end: msg.audio_end,
                confidence: msg.confidence,
                words: msg.words,
            };
            await ai.insertTranscript(t);
            if (data !== undefined) {
                if (config.saveSessionFolder.length > 0) {
                    const newPath = path.join(config.saveSessionFolder, recordingId, data.session.count.toString());
                    await fs.promises.mkdir(newPath, { recursive: true });
                    const name = path.join(newPath, data.session.transcripts.toString().padStart(5, '0') + '.json');
                    data.session.transcripts++;
                    await fs.promises.writeFile(name, JSON.stringify(msg, null, ' '));
                }
                if (data.terminated)
                    return;
            }
            await ai.setEndTime(recordingId, msg.audio_end);
        }
    });
    // pick up unfinished parts
    // skip it if last socket closed with audio short message
    if (!audioShort) {
        const end_time = await ai.getEndTime(recordingId);
        const segments = await ai.getSegments(recordingId);
        segments.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        logger.trace({ end_time, segments }, 'unfinished segments');
        let count = 0;
        let idx = -1;
        let offset = 0;
        for (let i = 0; i < segments.length; ++i) {
            const s = segments[i];
            if (count + s.duration * 1000 >= end_time) {
                offset = end_time - count;
                idx = i;
                break;
            }
            count += s.duration * 1000;
        }
        if (idx > -1) {
            socketData.firstSegment = segments[idx];
            socketData.segmentOffset = offset;
            for (let i = idx; i < segments.length; ++i) {
                await sendSegment(socketData, segments[i], offset, tmpOutput);
                offset = 0;
            }
        }
    }
    await ai.clear(recordingId);
    return socketData;
}
function createWebSocket(session_id) {
    let url = 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000';
    if (session_id !== undefined && session_id.length > 0) {
        url = 'wss://api.assemblyai.com/v2/realtime/ws/' + session_id;
    }
    logger.debug({ url, session_id }, 'create websocket');
    const ws = new WebSocketAsPromised(url, {
        // @ts-ignore
        createWebSocket: (url) => {
            return new WebSocket(url, undefined, {
                headers: {
                    authorization: config.token,
                },
            });
        },
        extractMessageData: (event) => event,
        packMessage: (data) => JSON.stringify(data),
        unpackMessage: (data) => JSON.parse(data.toString()),
    });
    return ws;
}
async function sendSegment(socketData, msg, offset, tmpOutput) {
    logger.trace({ msg, offset }, 'send segment');
    let segmentTime = 1.2;
    if (msg.duration - offset < 1.7) {
        segmentTime = msg.duration - offset / 1000 + 0.1;
    }
    logger.trace({ segmentTime, duration: msg.duration, offset: msg.offset }, 'segment time');
    const command = Ffmpeg()
        .input(path.join(msg.path))
        .seek(offset / 1000)
        .outputOptions('-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1', '-af', 'aresample=async=1000', '-f', 'segment', '-segment_time', segmentTime.toString())
        .output(path.join(tmpOutput, 'out%03d.wav'));
    await execFfmpeg(command);
    const waves = await fs.promises.readdir(tmpOutput);
    logger.trace({ files: waves }, 'wav files');
    for (let ii = 0; ii < waves.length; ++ii) {
        const name = path.join(tmpOutput, waves[ii]);
        const content = await fs.promises.readFile(name);
        const data = Buffer.from(content).toString('base64');
        logger.trace({ name, size: data.length }, 'sending file');
        socketData.socket.sendPacked({
            audio_data: data,
        });
        if (config.saveSessionFolder.length > 0) {
            const newPath = path.join(config.saveSessionFolder, msg.recordingId, socketData.session.count.toString());
            await fs.promises.mkdir(newPath, { recursive: true });
            const newName = path.join(newPath, socketData.session.waves.toString().padStart(5, '0') + '.wav');
            socketData.session.waves++;
            await fs.promises.rename(name, newName);
        }
        else {
            await fs.promises.rm(name);
        }
    }
}
