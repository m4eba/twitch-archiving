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
import { downloadSegment, initLogger } from '@twitch-archiving/utils';
import { createClient } from 'redis';
import {
  PlaylistSegmentMessage,
  PlaylistType,
  SegmentDownloadedMessage,
} from '@twitch-archiving/messages';
import {
  getFile,
  getRecordingId,
  initPostgres,
  initRedis,
  startFile,
  updateFileDownloadSize,
  updateFileSize,
  updateFileStatus,
  incrementFileRetries,
  finishedFile,
} from '@twitch-archiving/database';

interface PlaylistConfig {
  inputTopic: string;
  outputTopic: string;
  outputPath: string;
  maxFileRetries: number;
  redisPrefix: string;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-playlist-segment' },
  outputTopic: { type: String, defaultValue: 'tw-segment' },
  outputPath: { type: String },
  maxFileRetries: { type: Number, defaultValue: 3 },
  redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
};

interface Config
  extends PlaylistConfig,
    KafkaConfig,
    RedisConfig,
    PostgresConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...PlaylistConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('segment-download');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

const redis: ReturnType<typeof createClient> = createClient({
  url: config.redisUrl,
});

await initPostgres(config);
await initRedis(config, config.redisPrefix);

await redis.connect();

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({ groupId: 'segment-download' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ message, heartbeat }) => {
    if (!message.key) return;
    if (!message.value) return;
    const seg: PlaylistSegmentMessage = JSON.parse(message.value.toString());
    logger.trace({ seg }, 'segment download');

    const filename = seg.sequenceNumber.toString().padStart(5, '0') + '.ts';

    const recordingId = await getRecordingId(seg.user);
    if (recordingId.length === 0) {
      logger.error({ seg }, 'recordingId not found');
      return;
    }

    const file = await getFile(recordingId, filename);
    if (file !== undefined) {
      if (file.status === 'error' && file.retries < config.maxFileRetries) {
        logger.debug({ recordingId, filename }, 'retry');
        await incrementFileRetries(recordingId, filename);
      } else {
        logger.debug(
          { recordingId, filename, status: file.status },
          'stop download'
        );
        return;
      }
    }

    const type = seg.type === PlaylistType.LIVE ? 'stream' : 'vod';
    const dir = path.join(config.outputPath, seg.user, type, seg.id);
    await fs.promises.mkdir(dir, { recursive: true });
    const name = path.join(dir, filename);

    await startFile(
      recordingId,
      filename,
      seg.sequenceNumber,
      seg.duration,
      new Date(seg.time)
    );
    try {
      let downloadSize: number = 0;
      logger.debug({ name }, 'download');
      await downloadSegment(seg, name, {
        updateProgress: async (_, __, size) => {
          downloadSize = size;
          heartbeat().catch(() => {});
        },
        updateFilesize: async (_, filename, __, totalSize) => {
          logger.debug(
            { recordingId, filename, totalSize },
            'update file size'
          );
          await updateFileSize(recordingId, filename, totalSize);
        },
      });

      logger.debug({ name, downloadSize }, 'filesize');
      await updateFileDownloadSize(recordingId, filename, downloadSize);
      await updateFileStatus(recordingId, filename, 'done');

      const msg: SegmentDownloadedMessage = {
        user: seg.user,
        id: seg.id,
        sequenceNumber: seg.sequenceNumber,
        filename,
        path: name,
      };

      await sendData(config.outputTopic, {
        key: seg.user,
        value: JSON.stringify(msg),
        timestamp: new Date().getTime().toString(),
      });
    } catch (e) {
      logger.debug('unable to download segement', { seg });
      await updateFileStatus(recordingId, filename, 'error');
    }
    await finishedFile(recordingId, seg.sequenceNumber);
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
