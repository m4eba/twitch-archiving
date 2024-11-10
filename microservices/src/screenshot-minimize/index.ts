import fs from 'fs';
import {
  KafkaConfig,
  KafkaConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import path from 'path';
import im from 'imagemagick';
import util from 'util';
import { env2arg, initLogger } from '@twitch-archiving/utils';
import type { ScreenshotDoneMessage } from '@twitch-archiving/messages';

const convert = util.promisify(im.convert);

interface ScreenshotConfig {
  inputTopic: string;
  outputTopic: string;
  screenshotFolder: string;
  width: number;
  deleteSource: boolean;
}

const ScreenshotConfigOpt: ArgumentConfig<ScreenshotConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-screenshot' },
  outputTopic: { type: String, defaultValue: 'tw-screenshot-minimized' },
  screenshotFolder: { type: String },
  width: { type: Number },
  deleteSource: { type: Boolean, defaultValue: true },
};

interface Config
  extends ScreenshotConfig,
    KafkaConfig,
    PostgresConfig,
    FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...KafkaConfigOpt,
  ...ScreenshotConfigOpt,
  ...PostgresConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });
  const logger: Logger = initLogger('screenshot-minimize');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
    retry: {
      retries: 100,
    },
  });

  logger.info({ topic: config.inputTopic }, 'subscribe');

  const consumer: Consumer = kafka.consumer({
    groupId: 'screenshot-minimize',
  });
  await consumer.connect();
  await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

  const producer: Producer = kafka.producer();
  await producer.connect();

  await consumer.run({
    partitionsConsumedConcurrently: 3,
    eachMessage: async ({ message }) => {
      if (!message.key) return;
      if (!message.value) return;

      const msg: ScreenshotDoneMessage = JSON.parse(message.value.toString());
      logger.debug({ msg }, 'screenhostDoneMessage');
      const output = path.join(config.screenshotFolder, msg.recordingId);

      await fs.promises.mkdir(output, { recursive: true });

      await convert([
        path.join(msg.path, msg.filename),
        '-resize',
        config.width.toString(),
        path.join(output, msg.filename),
      ]);

      if (config.deleteSource) {
        await fs.promises.rm(path.join(msg.path, msg.filename));
      }

      const outMsg: ScreenshotDoneMessage = {
        recordingId: msg.recordingId,
        index: msg.index,
        filename: msg.filename,
        path: output,
      };

      await sendData(config.outputTopic, {
        key: message.key,
        value: JSON.stringify(outMsg),
        timestamp: new Date().getTime().toString(),
      });
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
}
