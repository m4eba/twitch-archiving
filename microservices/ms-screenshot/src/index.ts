import fs from 'fs';
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
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import path from 'path';
import Ffmpeg from 'fluent-ffmpeg';
import { execFfmpeg, initLogger } from '@twitch-archiving/utils';
import {
  initPostgres,
  initRedis,
  storyboard as sb,
} from '@twitch-archiving/database';
import {
  PlaylistMessage,
  PlaylistMessageType,
  ScreenshotDoneMessage,
  SegmentDownloadedMessage,
} from '@twitch-archiving/messages';

interface ScreenshotConfig {
  inputTopic: string;
  outputTopic: string;
  user: string[];
  interval: number;
  rows: number;
  columns: number;
  screenshotFolder: string;
  redisPrefix: string;
}

const ScreenshotConfigOpt: ArgumentConfig<ScreenshotConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-playlist' },
  outputTopic: { type: String, defaultValue: 'tw-screenshot' },
  user: { type: String, multiple: true },
  interval: { type: Number, defaultValue: 10.0 },
  rows: { type: Number },
  columns: { type: Number },
  screenshotFolder: { type: String },
  redisPrefix: { type: String, defaultValue: 'tw-screenshot-' },
};

interface Config
  extends ScreenshotConfig,
    KafkaConfig,
    RedisConfig,
    PostgresConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...ScreenshotConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('screenshot');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initPostgres(config);
await sb.createTable();

const userSet = new Set<string>();
config.user.forEach((u) => userSet.add(u));

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({ groupId: 'screenshot' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ message }) => {
    if (!message.key) return;
    if (!message.value) return;

    const playMsg: PlaylistMessage = JSON.parse(message.value.toString());
    logger.trace({ user: message.key, msg: playMsg }, 'playlistMessage');
    if (!userSet.has(playMsg.user)) return;

    if (playMsg.type !== PlaylistMessageType.DOWNLOAD) {
      return;
    }
    const msg = playMsg as SegmentDownloadedMessage;
    const filesPerBoard = config.rows * config.columns;
    let board = await sb.getLatestStoryBoard(playMsg.recordingId);

    const filename = msg.sequenceNumber.toString().padStart(5, '0') + '.png';
    const output = path.join(config.screenshotFolder, msg.recordingId);

    let offset = -1;
    if (board === undefined) {
      board = {
        recording_id: playMsg.recordingId,
        index: 0,
        time_offset: 0,
        first_sequence: msg.sequenceNumber,
        interval: config.interval,
        rows: config.rows,
        columns: config.columns,
        slug: '',
        data: { current_offset: 0, images: [filename] },
      };
      offset = 0;
      await sb.insertStoryboard(board);
    } else {
      if (board.data.current_offset + msg.duration >= config.interval) {
        offset = config.interval - board.data.current_offset;
        // screenshot on last frame doesn't work
        if (offset > msg.duration - 0.05) {
          offset = msg.duration - 0.05;
        }
        board.data.current_offset =
          board.data.current_offset + msg.duration - config.interval;

        // if we hit max images per board - save in next board
        if (board.data.images.length === board.first_sequence + filesPerBoard) {
          board.first_sequence = msg.sequenceNumber;
          board.time_offset = msg.offset + offset;
          board.index = board.index + 1;
          board.data.images = [filename];
          await sb.insertStoryboard(board);
        } else {
          board.data.images.push(filename);
          await sb.updateStoryboard(board);
        }
      } else {
        board.data.current_offset = board.data.current_offset + msg.duration;
        await sb.updateStoryboard(board);
      }
    }

    if (offset > -1) {
      await fs.promises.mkdir(output, { recursive: true });

      const command = Ffmpeg()
        .input(msg.path)
        .seek(offset)
        .outputOptions('-vframes', '1', '-q:v', '2')
        .output(path.join(output, filename));

      await execFfmpeg(command);

      const doneMsg: ScreenshotDoneMessage = {
        recordingId: msg.recordingId,
        index: board.index,
        filename,
        path: output,
      };
      await sendData(config.outputTopic, {
        key: msg.user,
        value: JSON.stringify(doneMsg),
        timestamp: new Date().getTime().toString(),
      });
    }
  },
});

async function sendData(topic: string, msg: Message): Promise<void> {
  const messages: TopicMessages[] = [];
  const topicMessage: TopicMessages = {
    topic,
    messages: [msg],
  };
  messages.push(topicMessage);
  logger.debug({ topic: topic, size: messages.length }, 'sending batch');
  await producer.sendBatch({ topicMessages: messages });
}
