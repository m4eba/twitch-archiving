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
import { initLogger, fileExists, randomStr } from '@twitch-archiving/utils';
import {
  ServiceConfig,
  ServiceConfigOpt,
  processMessage,
} from '@twitch-archiving/ms-playlist-storyboard';
import { getRecPrismaClient, sendData } from '@twitch-archiving/database';
import { Kafka, Producer } from 'kafkajs';
import {
  PlaylistMessage,
  PlaylistMessageType,
  RecordingStartedMessage,
  SegmentDownloadedMessage,
  SegmentDownloadedStatus,
  TaskData,
  TaskRequestMsg,
} from '@twitch-archiving/messages';
import { Task } from '@twitch-archiving/prisma/prisma/generated/rec-client';

interface PlaylistConfig {
  recording: string;
  name: string;
  interval: number;
  rows: number;
  columns: number;
  width: number;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  recording: { type: String },
  name: { type: String },
  interval: { type: Number },
  rows: { type: Number },
  columns: { type: Number },
  width: { type: Number },
};

console.log(process.env.REC_DATABASE_URL);
interface Config extends PlaylistConfig, KafkaConfig, FileConfig {}

const config: Config = parse<Config>(
  {
    ...PlaylistConfigOpt,
    ...KafkaConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

const producer: Producer = kafka.producer();
await producer.connect();

const logger: Logger = initLogger('start-storyboard');
const client = getRecPrismaClient();

const recording = await client.recording.findFirst({
  where: {
    id: BigInt(config.recording),
  },
});

if (!recording) {
  console.log('recording not found');
  process.exit(1);
}

const serviceConfig: ServiceConfig = {
  inputTopic: '',
  screenshotTopic: '',
  user: [recording.channel],
  interval: config.interval,
  rows: config.rows,
  columns: config.columns,
  width: config.width,
  name: config.name,
};
let msg: PlaylistMessage = {
  type: PlaylistMessageType.START,
  user: recording.channel,
  id: recording.site_id,
  recordingId: recording.id.toString(),
};
await processMessage(serviceConfig, producer, msg);

let count = 0;
while (true) {
  const files = await client.file.findMany({
    where: {
      recordingId: recording.id,
    },
    orderBy: {
      seq: 'asc',
    },
    skip: count,
    take: 50,
  });
  if (files.length === 0) break;
  count += files.length;

  for (let i = 0; i < files.length; ++i) {
    const f = files[i];

    const seg: SegmentDownloadedMessage = {
      ...msg,
      type: PlaylistMessageType.DOWNLOAD,
      sequenceNumber: f.seq,
      offset: f.timeOffset.toNumber(),
      duration: f.duration.toNumber(),
      filename: f.name,
      path: '',
      status: SegmentDownloadedStatus.DONE,
    };
    await processMessage(serviceConfig, producer, seg);
  }
}

msg.type = PlaylistMessageType.END;
await processMessage(serviceConfig, producer, msg);
