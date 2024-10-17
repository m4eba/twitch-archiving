import fs from 'fs';
import path from 'path';
import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';

import { ArgumentConfig, parse } from 'ts-command-line-args';
import { RecPrisma, RecPrismaClient } from '@twitch-archiving/prisma';
import { initLogger, fileExists, env2arg } from '@twitch-archiving/utils';
import {
  ServiceConfig,
  ServiceConfigOpt,
  processMessage,
} from '@twitch-archiving/microservices/src/playlist-storyboard/lib.js';
import { getRecPrismaClient } from '@twitch-archiving/database';
import { Kafka, Producer } from 'kafkajs';
import {
  PlaylistMessage,
  PlaylistMessageType,
  SegmentDownloadedMessage,
  SegmentDownloadedStatus,
  StoryboardData,
} from '@twitch-archiving/messages';

interface PlaylistConfig {
  storyboard: number[];
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  storyboard: { type: Number, multiple: true },
};

console.log(process.env.REC_DATABASE_URL);
interface Config extends PlaylistConfig, KafkaConfig, FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...PlaylistConfigOpt,
  ...KafkaConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
  });

  const producer: Producer = kafka.producer();
  await producer.connect();

  const logger: Logger = initLogger('start-screenshot');
  const client = getRecPrismaClient();

  for (let i = 0; i < config.storyboard.length; ++i) {
    await start(config.storyboard[i]);
  }

  async function start(storyboardId: number): Promise<void> {
    let offset = 0;

    const storyboard = await client.storyboard.findFirst({
      where: {
        id: storyboardId,
      },
    });
    if (!storyboard) {
      console.log('storyboard not found', storyboardId);
      process.exit(1);
    }
    console.log('storyboard', storyboard);
    const data: StoryboardData = storyboard.data as any;
    console.log('data', data);

    const config: ServiceConfig = {
      columns: storyboard.columns,
      rows: storyboard.rows,
      interval: storyboard.interval,
      name: storyboard.name,
      width: storyboard.width,
      height: storyboard.height,
      inputTopic: '',
      screenshotTopic: '',
      user: [],
    };
    const recordingId = storyboard.recordingId;

    if (data.lastSegmentSeq === -1) {
      const startMsg: PlaylistMessage = {
        type: PlaylistMessageType.START,
        recordingId: recordingId.toString(),
        user: '',
        id: '',
      };
      await processMessage(config, producer, startMsg);
    }
    //offset = data.lastSegmentSeq > -1 ? data.lastScreenshotIndex : 0;
    offset = data.lastSegmentSeq > -1 ? data.lastSegmentSeq : 0;

    while (true) {
      const files = await client.file.findMany({
        where: {
          recordingId,
        },
        orderBy: {
          seq: 'asc',
        },
        take: 1000,
        skip: offset,
      });
      if (files.length === 0) break;

      for (let i = 0; i < files.length; ++i) {
        const msg: SegmentDownloadedMessage = {
          type: PlaylistMessageType.DOWNLOAD,
          recordingId: recordingId.toString(),
          id: '',
          user: '',
          sequenceNumber: files[i].seq,
          duration: files[i].duration.toNumber(),
          filename: files[i].name,
          offset: files[i].timeOffset.toNumber(),
          path: '',
          status: SegmentDownloadedStatus.DONE,
        };
        console.log('process', msg);
        await processMessage(config, producer, msg);
      }

      offset += 1000;
    }

    const endMsg: PlaylistMessage = {
      type: PlaylistMessageType.END,
      recordingId: recordingId.toString(),
      user: '',
      id: '',
    };
    await processMessage(config, producer, endMsg);
  }

  kafka.producer;
}
