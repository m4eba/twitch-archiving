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
  RetryConfig,
  RetryConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import path from 'path';
import Ffmpeg from 'fluent-ffmpeg';
import {
  execFfmpeg,
  fileExists,
  initLogger,
  randomStr,
} from '@twitch-archiving/utils';
import {
  getRecPrismaClient,
  initPostgres,
  initRedis,
  storyboard as sb,
} from '@twitch-archiving/database';
import {
  PlaylistMessage,
  PlaylistMessageType,
  ScreenshotDoneMessage,
  ScreenshotRequestMessage,
  SegmentDownloadedMessage,
  TaskDoneMsg,
} from '@twitch-archiving/messages';
import { retry } from '@twitch-archiving/retry';

interface ScreenshotConfig {
  inputTopic: string;
  taskDoneTopic: string;
  screenshotFolder: string;
  segmentFolder: string;
}

const ScreenshotConfigOpt: ArgumentConfig<ScreenshotConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-screenshot-request' },
  taskDoneTopic: { type: String, defaultValue: 'tw-task-done' },
  screenshotFolder: { type: String },
  segmentFolder: { type: String },
};

interface Config
  extends ScreenshotConfig,
    KafkaConfig,
    RedisConfig,
    RetryConfig,
    PostgresConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...ScreenshotConfigOpt,
    ...RedisConfigOpt,
    ...RetryConfigOpt,
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

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({ groupId: 'screenshot' });
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

        const msg: ScreenshotRequestMessage = JSON.parse(
          message.value.toString()
        );
        logger.trace({ msg }, 'screenshotRequestMessage');

        const recording = await client.recording.findFirst({
          where: {
            id: BigInt(msg.recordingId),
          },
        });
        logger.trace({ recording }, 'recording');
        if (!recording) {
          return;
          //throw new Error('recording not found ' + msg.recordingId);
        }

        const filename =
          msg.screenshot_idx.toString().padStart(5, '0') + '.png';
        const output = path.join(
          config.screenshotFolder,
          msg.recordingId,
          msg.name
        );

        const inputFilename = msg.seq.toString().padStart(5, '0') + '.ts';
        // TODO stream, vod
        const input = path.join(
          config.segmentFolder,
          recording.channel,
          'stream',
          recording.site_id,
          inputFilename
        );

        await fs.promises.mkdir(output, { recursive: true });

        for (let i = 0; i < 3; ++i) {
          logger.trace({ retry: i }, 'starting ffmpeg');
          const command = Ffmpeg()
            .input(input)
            .seek(msg.offset)
            //.outputOptions('-vframes', '1', '-q:v', '2')
            .outputOptions(
              '-frames:v',
              '1',
              '-vf',
              `scale=${msg.width}:-1`,
              '-q:v',
              '2'
            )
            .output(path.join(output, filename));

          let retry = false;
          let err = '';
          try {
            err = await execFfmpeg(command);
          } catch (e) {
            logger.error({ error: e }, 'ffmpeg error');
            retry = true;
          }

          logger.trace({ out: err }, 'ffmpeg output');

          if (
            err.indexOf('Output file is empty, nothing was encoded') > -1 ||
            err.indexOf('Output file #0 does not contain any stream') > -1
          ) {
            retry = true;
          }

          if (!retry) {
            if (!fileExists(path.join(output, filename))) {
              retry = true;
            }
          }

          if (retry) {
            if (msg.offset < 0.05) {
              // just skip this
              break;
            }
            // reduce the offset a little and try again
            msg.offset = msg.offset - 0.05;
          } else {
            // success
            break;
          }
        }

        const doneMsg: TaskDoneMsg = {
          groupId: msg.groupId,
          taskId: msg.taskId,
        };
        await sendData(config.taskDoneTopic, {
          key: msg.groupId,
          value: JSON.stringify(doneMsg),
          timestamp: new Date().getTime().toString(),
        });
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
