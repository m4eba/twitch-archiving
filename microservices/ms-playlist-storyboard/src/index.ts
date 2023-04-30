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
  StoryboardData,
  StoryboardFileData,
  StoryboardRequestMessage,
} from '@twitch-archiving/messages';
import { RecPrismaClient } from '@twitch-archiving/prisma';
import {
  Prisma,
  StoryboardFile,
} from '@twitch-archiving/prisma/prisma/generated/rec-client';
import { randomUUID } from 'crypto';
import { processMessage, ServiceConfig, ServiceConfigOpt } from './lib.js';

interface Config
  extends ServiceConfig,
    KafkaConfig,
    RedisConfig,
    PostgresConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...ServiceConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('playlist-storyboard');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initPostgres(config);
await sb.createTable();

const userSet = new Set<string>();
config.user.forEach((u) => userSet.add(u));

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({
  groupId: 'playlist-storyboard-' + config.name,
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

    const playMsg: PlaylistMessage = JSON.parse(message.value.toString());
    logger.trace({ user: message.key, msg: playMsg }, 'playlistMessage');
    if (!userSet.has(playMsg.user)) return;

    await processMessage(config, producer, playMsg);
  },
});
