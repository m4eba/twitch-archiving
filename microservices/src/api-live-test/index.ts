import fs from 'fs';
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
  TwitchConfigOpt,
  TwitchConfig,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, Message, TopicMessages } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { env2arg, execFfmpeg, initLogger } from '@twitch-archiving/utils';
import {
  PlaylistMessage,
  PlaylistMessageType,
  SegmentDownloadedMessage,
} from '@twitch-archiving/messages';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { download as dl, initPostgres } from '@twitch-archiving/database';

interface LiveTestConfig {
  outputTopic: string;
  user: string[];
  interval: number;
}

const LiveTestConfigOpt: ArgumentConfig<LiveTestConfig> = {
  outputTopic: { type: String, defaultValue: 'tw-live' },
  user: { type: String, multiple: true },
  interval: { type: Number, defaultValue: 60 },
};

interface Config
  extends LiveTestConfig,
    TwitchConfig,
    KafkaConfig,
    PostgresConfig,
    FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...KafkaConfigOpt,
  ...LiveTestConfigOpt,
  ...PostgresConfigOpt,
  ...TwitchConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });

  const logger: Logger = initLogger('api-live-test');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
    retry: {
      retries: 100,
    },
  });

  await initPostgres(config);

  const producer: Producer = kafka.producer();
  await producer.connect();

  const authProvider = new ClientCredentialsAuthProvider(
    config.twitchClientId,
    config.twitchClientSecret
  );
  const apiClient = new ApiClient({ authProvider });

  async function testUser(user: string) {
    const recording = await dl.getRunningRecording(user);
    logger.trace({ recording, user }, 'test recording');
    if (recording) return;
    const stream = await apiClient.streams.getStreamByUserName(user);
    logger.debug({ stream, user }, 'test user');
    if (stream !== null) {
      logger.trace({ user }, 'send reload');
      sendData(config.outputTopic, {
        key: user,
        value: JSON.stringify({ forceReload: true, msg: 'api live test' }),
        timestamp: new Date().getTime().toString(),
      });
    }
  }

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

  config.user.forEach((u) => testUser(u));

  setInterval(() => {
    config.user.forEach((u) => testUser(u));
  }, config.interval * 1000);
}
