import fs from 'fs';
import { Readable } from 'stream';
import path from 'path';
import {
  KafkaConfig,
  KafkaConfigOpt,
  RedisConfig,
  RedisConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { env2arg, execFfmpeg, initLogger } from '@twitch-archiving/utils';
import {
  PlaylistMessage,
  PlaylistMessageType,
  SegmentDownloadedMessage,
} from '@twitch-archiving/messages';
import { initPostgres, vosk, transcript } from '@twitch-archiving/database';
import Ffmpeg from 'fluent-ffmpeg';
import WebSocket from 'ws';
import WebSocketAsPromised from 'websocket-as-promised';
import wav from 'wav';

interface VoskConfig {
  inputTopic: string;
  outputTopic: string;
  user: string[];
  url: string;
  sessionLength: number;
  tmpFolder: string;
}

const VoskConfigOpt: ArgumentConfig<VoskConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-playlist' },
  outputTopic: { type: String, defaultValue: 'tw-vosk' },
  user: { type: String, multiple: true },
  url: { type: String },
  sessionLength: { type: Number, defaultValue: 30 },
  tmpFolder: { type: String },
};

interface Config
  extends VoskConfig,
    KafkaConfig,
    RedisConfig,
    PostgresConfig,
    FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...KafkaConfigOpt,
  ...VoskConfigOpt,
  ...RedisConfigOpt,
  ...PostgresConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });
  const logger: Logger = initLogger('vosk');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
  });

  await initPostgres(config);

  await vosk.createTable();
  await transcript.createTable();

  const userSet = new Set<string>();
  config.user.forEach((u) => userSet.add(u));

  interface Session {
    socket: WebSocketAsPromised;
    init: boolean;
    byteOffset: number;
    duration: number;
    msg: SegmentDownloadedMessage | null;
    firstMsg: SegmentDownloadedMessage | null;
    playlistEnded: boolean;
  }
  const sessionMap = new Map<string, Session>();

  const consumer: Consumer = kafka.consumer({
    groupId: 'vosk-segments',
  });
  await consumer.connect();
  await consumer.subscribe({
    topic: config.inputTopic,
    fromBeginning: true,
  });

  const producer: Producer = kafka.producer();
  await producer.connect();

  await consumer.run({
    partitionsConsumedConcurrently: 3,
    eachMessage: async ({ message }) => {
      if (!message.key) return;
      if (!message.value) return;

      const m: PlaylistMessage = JSON.parse(message.value.toString());

      if (m.type === PlaylistMessageType.END) {
        const session = sessionMap.get(m.recordingId);
        if (session !== undefined) {
          session.playlistEnded = true;
          const socket = session.socket;
          if (socket !== undefined && socket.isOpened) {
            logger.debug({ msg: session.msg }, 'send eof');
            await socket.send('{"eof" : 1}');
            await responseMessage(session);
            await socket.close();
          }
        }

        logger.debug({ m }, 'recording end message');
        return;
      }

      if (m.type === PlaylistMessageType.START) {
        // nothing todo
        return;
      }

      if (m.type !== PlaylistMessageType.DOWNLOAD) {
        // this should no happen???
        return;
      }

      const msg: SegmentDownloadedMessage = m as SegmentDownloadedMessage;
      logger.trace({ user: message.key, msg }, 'playlistSegmentMessage');
      if (!userSet.has(msg.user)) return;

      const tmpOutput = path.join(config.tmpFolder, msg.user, msg.recordingId);
      await fs.promises.mkdir(tmpOutput, { recursive: true });

      const session = await getSession(msg.recordingId, tmpOutput);
      logger.trace({ recordingId: msg.recordingId }, 'websocket ready');

      if (session.firstMsg === null) {
        session.firstMsg = msg;
      }
      session.msg = msg;
      try {
        const filename = await prepareSegment(session, tmpOutput);
        await sendSegment(session, filename, tmpOutput);
      } catch (e: any) {
        if (e.toString().indexOf('does not contain any stream') > -1) {
          logger.debug({ error: e.toString() }, 'empty stream');
          return;
        }
        throw e;
      }

      //throw new Error('lets do it again');
    },
  });

  async function getSession(
    recordingId: string,
    tmpOutput: string
  ): Promise<Session> {
    let session = sessionMap.get(recordingId);
    let socket: WebSocketAsPromised | undefined = undefined;
    if (session !== undefined) {
      socket = session.socket;
    }
    if (session !== undefined && socket !== undefined) {
      if (socket.isOpened) {
        return session;
      }
      logger.debug({ recordingId }, 'socket not open');
    }

    socket = createWebSocket(recordingId);

    await socket.open();

    session = {
      socket,
      init: false,
      byteOffset: 0,
      duration: 0,
      firstMsg: null,
      msg: null,
      playlistEnded: false,
    };
    sessionMap.set(recordingId, session);
    logger.trace({ recordingId }, 'session started');

    return session;
  }

  function createWebSocket(recordingId: string): WebSocketAsPromised {
    logger.debug({ url: config.url }, 'create websocket');
    const socket = new WebSocketAsPromised(config.url, {
      // @ts-ignore
      createWebSocket: (url) => new WebSocket(url),
      extractMessageData: (event) => event,
      packMessage: (data) => JSON.stringify(data),
      unpackMessage: (data) => JSON.parse(data.toString()),
    });

    socket.onError.addListener((e) => {
      logger.error({ recordingId, error: e }, 'websocket error');
      if (socket !== undefined) {
        socket.close();
      }
    });
    socket.onClose.addListener(() => {
      logger.debug({ recordingId }, 'websocket closed');
    });

    return socket;
  }

  async function prepareSegment(
    session: Session,
    tmpOutput: string
  ): Promise<string> {
    if (session.msg === null) {
      throw new Error('no message in session');
    }
    const msg = session.msg;
    logger.trace({ msg }, 'prepare segment');
    const wavfilename = msg.sequenceNumber.toString().padStart(5, '0') + '.wav';

    //ffmpeg -y  -i input.mp4  -acodec pcm_s16le -f s16le -ac 1 -ar 16000 output.pcm
    const command = Ffmpeg()
      .input(path.join(msg.path))
      .outputOptions('-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1')
      .output(path.join(tmpOutput, wavfilename));

    await execFfmpeg(command);

    return wavfilename;
  }

  async function sendSegment(
    session: Session,
    filename: string,
    tmpOutput: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      logger.trace({ msg: session.msg, filename }, 'send wav');

      const sampleRate = 16000;
      const bufferSize = 2 * sampleRate * 1.0;
      const buf = await fs.promises.readFile(path.join(tmpOutput, filename));

      if (!session.init) {
        await session.socket.send(
          `{ "config" : { "sample_rate" : ${sampleRate} } }`
        );
        session.init = true;
      }

      let bytesRead = 0;
      let idx = 0;
      while (true) {
        const data = buf.slice(idx, Math.min(idx + bufferSize, buf.length));
        idx += bufferSize;

        //console.log('data', data);
        if (data.length === 0) break;

        bytesRead += data.length;

        logger.trace({ bytesRead, offset: session.byteOffset }, 'wav read');
        if (bytesRead < session.byteOffset) continue;

        await session.socket.send(new Uint8Array(data));
        const result = await responseMessage(session);
        if (result) {
          session.byteOffset = bytesRead;
          logger.trace(
            {
              sessionDuration: session.duration,
              maxLength: config.sessionLength,
            },
            'testing duration'
          );
          if (session.duration >= config.sessionLength) {
            await session.socket.close();
            session.socket = await createWebSocket(session.msg!.recordingId);
            await session.socket.open();
            await session.socket.send(
              `{ "config" : { "sample_rate" : ${sampleRate} } }`
            );
            session.duration = 0;
            session.firstMsg = session.msg;
          }
        }
      }

      session.byteOffset = 0;
      if (session.msg) {
        session.duration += session.msg.duration;
      }
      resolve();
    });
  }

  async function responseMessage(session: Session): Promise<boolean> {
    logger.trace({ msg: session.msg }, 'responseMessage');
    const resp = await session.socket.waitUnpackedMessage((data) => true);
    logger.trace({ resp }, 'received response');
    if (resp.result === undefined) return false;
    if (resp.result.length === 0) return false;

    if (session.firstMsg === null || session.msg === null) {
      logger.error(
        { msg: session.msg, fistMsg: session.firstMsg },
        'responseMessage null value'
      );
      throw new Error('unexpected null value in session');
    }

    const offset = Math.round(resp.result[0].start * 1000);
    const end = Math.round(resp.result[resp.result.length - 1].end * 1000);
    const segment_sequence = session.firstMsg.sequenceNumber;
    const total_start = Math.round(session.firstMsg.offset * 1000 + offset);
    const total_end = Math.round(session.firstMsg.offset * 1000 + end);

    const msg = session.msg;
    const t: transcript.Transcript = {
      id: '0',
      recording_id: msg.recordingId,
      created: new Date(),
      transcript: resp.text,
      total_start,
      total_end,
      segment_sequence,
      audio_start: offset,
      audio_end: end,
      confidence: 1,
      words: resp.result,
    };
    await transcript.insertTranscript(t);
    return true;
  }
}
