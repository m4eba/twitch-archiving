import fs from 'fs';
import {
  KafkaConfig,
  KafkaConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  FileConfig,
  FileConfigOpt,
  RetryConfigOpt,
  RetryConfig,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import path from 'path';
import child_process from 'child_process';
import util from 'util';
import { fileExists, initLogger } from '@twitch-archiving/utils';
import {
  storyboard as sb,
  screenshot as ss,
  initPostgres,
  getRecPrismaClient,
} from '@twitch-archiving/database';
import type {
  ScreenshotDoneMessage,
  StoryboardDoneMessage,
  StoryboardFileData,
  StoryboardRequestMessage,
} from '@twitch-archiving/messages';
import { retry } from '@twitch-archiving/retry';

const exec = util.promisify(child_process.exec);

interface StoryboardConfig {
  inputTopic: string;
  taskDoneTopic: string;
  screenshotFolder: string;
  storyboardFolder: string;
}

const StoryboardConfigOpt: ArgumentConfig<StoryboardConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-storyboard-request' },
  taskDoneTopic: { type: String, defaultValue: 'tw-task-done' },
  screenshotFolder: { type: String },
  storyboardFolder: { type: String },
};

interface Config
  extends StoryboardConfig,
    KafkaConfig,
    PostgresConfig,
    RetryConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...StoryboardConfigOpt,
    ...PostgresConfigOpt,
    ...RetryConfigOpt,
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

await initPostgres(config);

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({
  groupId: 'screenshot-storyboard',
});
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

const client = getRecPrismaClient();

await consumer.run({
  partitionsConsumedConcurrently: 3,
  eachMessage: async ({ message, partition, topic }) => {
    await retry(
      async () => {
        if (!message.key) return;
        if (!message.value) return;

        const msg: StoryboardRequestMessage = JSON.parse(
          message.value.toString()
        );

        const output = path.join(
          config.storyboardFolder,
          msg.recordingId,
          msg.name
        );

        await fs.promises.mkdir(output, { recursive: true });

        const board = await client.storyboard.findFirst({
          where: {
            recordingId: BigInt(msg.recordingId),
            name: msg.name,
          },
        });

        if (!board) {
          throw new Error('storyboard not found');
        }

        const filesPerBoard = board.rows * board.columns;

        const file = await client.storyboardFile.findFirst({
          where: {
            storyboardId: board.id,
            index: msg.storyboard_idx,
          },
        });

        if (!file) {
          throw new Error('storyboard file not found');
        }

        if (!file.data) {
          throw new Error('storyboard file as no data');
        }
        const data: StoryboardFileData = file.data as any;

        const seq = data.screenshots.map((v) => v.screenshot_idx).sort();
        logger.trace({ seq }, 'screenshot sequences');

        const args: string[] = [];
        for (let i = 0; i < seq.length; ++i) {
          const filename = seq[i].toString().padStart(5, '0') + '.png';
          const image = path.join(
            config.screenshotFolder,
            msg.recordingId,
            msg.name,
            filename
          );
          logger.trace({ image }, 'test screenshot image');
          if (await fileExists(image)) {
            args.push(`"${image}"`);
          } else {
            args.push('null:');
          }
        }

        logger.trace({ msg, args }, 'montage file args');

        const filename = file.index.toString().padStart(5, '0') + '.png';
        await fs.promises.mkdir(output, { recursive: true });

        let command = 'montage ' + args.join(' ');
        command += ` -tile ${board.columns}x${board.rows}`;
        command += ' -geometry +0+0';
        command += ` ${path.join(output, filename)}`;
        logger.debug({ msg, command }, 'montage command');
        await exec(command);

        await sendData(config.taskDoneTopic, {
          key: msg.groupId,
          value: JSON.stringify(msg),
          timestamp: new Date().getTime().toString(),
        });

        // TODO clear
      },
      {
        //retryConfig: config,
        retryConfig: {
          retries: 10000,
          failedTopic: config.failedTopic,
        },
        message,
        partition,
        producer,
        topic,
      }
    );
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
