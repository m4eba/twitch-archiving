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
import child_process from 'child_process';
import util from 'util';
import { initLogger } from '@twitch-archiving/utils';
import {
  initRedis,
  storyboard as sb,
  screenshot as ss,
} from '@twitch-archiving/database';
import type {
  ScreenshotDoneMessage,
  StoryboardDoneMessage,
} from '@twitch-archiving/messages';

const exec = util.promisify(child_process.exec);

interface StoryboardConfig {
  inputTopic: string;
  outputTopic: string;
  storyboardFolder: string;
  redisPrefix: string;
}

const StoryboardConfigOpt: ArgumentConfig<StoryboardConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-screenshot-minimized' },
  outputTopic: { type: String, defaultValue: 'tw-storyboard' },
  storyboardFolder: { type: String },
  redisPrefix: { type: String, defaultValue: 'tw-screenshot-' },
};

interface Config
  extends StoryboardConfig,
    KafkaConfig,
    RedisConfig,
    PostgresConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...StoryboardConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('screenshot-storyboard');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initRedis(config, config.redisPrefix);

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({
  groupId: 'screenshot-storyboard',
});
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ message }) => {
    if (!message.key) return;
    if (!message.value) return;

    const msg: ScreenshotDoneMessage = JSON.parse(message.value.toString());
    const output = path.join(config.storyboardFolder, msg.recordingId);

    await fs.promises.mkdir(output, { recursive: true });

    const board = await sb.getStoryboard(msg.recordingId, msg.index);
    if (board === undefined) {
      logger.error({ msg }, 'board not found');
      return;
    }
    const filesPerBoard = board.rows * board.columns;

    const sbIndex = Math.floor(msg.index / filesPerBoard);
    logger.debug({ msg, filesPerBoard, sbIndex }, 'msg');

    // build arument list
    const args: string[] = [];
    for (let i = 0; i < board.data.images.length; ++i) {
      if (board.data.images[i] !== null) {
        args.push('"' + path.join(msg.path, board.data.images[i]) + '"');
      } else {
        args.push('null:');
      }
    }
    logger.trace({ msg, args }, 'montage file args');

    const filename = board.index.toString().padStart(5, '0') + '.png';
    await fs.promises.mkdir(output, { recursive: true });

    let command = 'montage ' + args.join(' ');
    command += ` -tile ${board.columns}x${board.rows}`;
    command += ' -geometry +0+0';
    command += ` ${path.join(output, filename)}`;
    logger.debug({ msg, command }, 'montage command');
    await exec(command);

    const outMsg: StoryboardDoneMessage = {
      recordingId: msg.recordingId,
      index: board.index,
      count: args.length,
      rows: board.rows,
      columns: board.columns,
      path: output,
      filename,
    };

    await sendData(config.outputTopic, {
      key: message.key,
      value: JSON.stringify(outMsg),
      timestamp: new Date().getTime().toString(),
    });

    // TODO clear
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
