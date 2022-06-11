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
import { initRedis, screenshot as ss } from '@twitch-archiving/database';
import type {
  ScreenshotDoneMessage,
  SegmentDownloadedMessage,
} from '@twitch-archiving/messages';

interface ScreenshotConfig {
  inputTopic: string;
  outputTopic: string;
  screenshotFolder: string;
  redisPrefix: string;
}

const ScreenshotConfigOpt: ArgumentConfig<ScreenshotConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-segment-ended' },
  outputTopic: { type: String, defaultValue: 'tw-screenshot-done' },
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

await initRedis(config, config.redisPrefix);

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

    const msg: SegmentDownloadedMessage = JSON.parse(message.value.toString());
    const request = await ss.getRequest(msg.recordingId, msg.sequenceNumber);
    if (request === undefined) return;

    logger.trace({ msg, request }, 'message request');
    const filename = request.index.toString().padStart(5, '0') + '.png';
    const output = path.join(config.screenshotFolder, msg.recordingId);

    await fs.promises.mkdir(output, { recursive: true });

    const command = Ffmpeg()
      .input(msg.path)
      .seek(request.offset)
      .outputOptions('-vframes', '1', '-q:v', '2')
      .output(path.join(output, filename));

    await execFfmpeg(command);

    await ss.rmRequest(msg.recordingId, msg.sequenceNumber);

    const doneMsg: ScreenshotDoneMessage = {
      recordingId: msg.recordingId,
      index: request.index,
      offset: request.offset,
      filename,
      path: output,
    };
    await sendData(config.outputTopic, {
      key: msg.user,
      value: JSON.stringify(doneMsg),
      timestamp: new Date().getTime().toString(),
    });
    if (await ss.isRecordingDone(msg.recordingId)) {
      logger.debug({ msg, request }, 'screenshot recording done');
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
