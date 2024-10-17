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
import {
  initLogger,
  fileExists,
  randomStr,
  env2arg,
} from '@twitch-archiving/utils';
import {
  ServiceConfig,
  ServiceConfigOpt,
  processMessage,
} from '@twitch-archiving/microservices/src/playlist-storyboard/lib.js';
import { getRecPrismaClient, sendData } from '@twitch-archiving/database';
import { Kafka, Producer } from 'kafkajs';
import {
  PlaylistMessage,
  PlaylistMessageType,
  SegmentDownloadedMessage,
  SegmentDownloadedStatus,
  TaskData,
  TaskRequestMsg,
} from '@twitch-archiving/messages';
import { Task } from '@twitch-archiving/prisma/prisma/generated/rec-client';

interface PlaylistConfig {
  storyboard: number;
  startIdx: number;
  endIdx: number;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  storyboard: { type: Number },
  startIdx: { type: Number, defaultValue: 0 },
  endIdx: { type: Number, defaultValue: 0 },
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

  if (config.endIdx === 0) {
    const sb = await client.storyboardFile.findFirst({
      where: {
        storyboardId: config.storyboard,
      },
      orderBy: {
        index: 'desc',
      },
    });
    if (!sb) {
      console.log('no storyboard found');
      process.exit(1);
    }
    config.endIdx = sb.index;
  }

  for (let i = config.startIdx; i <= config.endIdx; ++i) {
    const groupId = `storyboard-${config.storyboard}-${i}`;
    console.log('group', groupId);
    const task = await client.task.findFirst({
      where: {
        task: 'storyboard',
        groupId,
      },
    });
    console.log('task', task);
    if (task) {
      await startTask(task);
    }
  }

  async function startTask(task: Task): Promise<void> {
    if (!task.data) throw new Error('task without data ' + task.id.toString());

    const client = getRecPrismaClient();
    await client.task.update({
      data: {
        started: new Date(),
      },
      where: {
        id: task.id,
      },
    });

    const data: TaskData<TaskRequestMsg> = task.data as any;
    data.data.taskId = task.id.toString();

    logger.trace(
      { topic: data.topic, data: data, source: task.task },
      'sending task request'
    );
    await sendData(producer, data.topic, {
      key: randomStr(),
      value: JSON.stringify(data.data),
      timestamp: new Date().getTime().toString(),
    });
  }

  await producer.disconnect();
}
