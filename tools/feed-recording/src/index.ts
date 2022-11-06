import path from 'path';
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
import {
  initPostgres,
  closePostgres,
  download as dl,
} from '@twitch-archiving/database';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import {
  PlaylistMessage,
  PlaylistMessageType,
  PlaylistType,
  RecordingEndedMessage,
  RecordingMessageType,
  RecordingSegmentMessage,
  SegmentDownloadedMessage,
  SegmentDownloadedStatus,
} from '@twitch-archiving/messages';
import { initLogger } from '@twitch-archiving/utils';

interface FeedRecordingConfig {
  id: string;
  outputTopic: string;
  path: string;
}

const FeedRecordingConfigOpt: ArgumentConfig<FeedRecordingConfig> = {
  id: { type: String },
  outputTopic: { type: String, defaultValue: 'tw-playlist' },
  path: { type: String },
};

interface Config
  extends FeedRecordingConfig,
    KafkaConfig,
    PostgresConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...FeedRecordingConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('feed-recording');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

const producer: Producer = kafka.producer();
await producer.connect();

await initPostgres(config);

const recording = await dl.getRecording(config.id);
logger.trace({ recording }, 'recording');

if (recording === undefined) {
  logger.error({ id: config.id }, 'recording not found');
  process.exit(-1);
}

const files = await dl.getAllFiles(config.id);

if (files === undefined) {
  logger.error({ id: config.id }, 'no files found');
  process.exit(-1);
}
logger.trace({ size: files.length }, 'number of files');

for (let i: number = 0; i < files.length; ++i) {
  const f: dl.File = files[i];
  const msg: SegmentDownloadedMessage = {
    type: PlaylistMessageType.DOWNLOAD,
    user: recording.channel,
    id: recording.site_id,
    recordingId: recording.id,
    sequenceNumber: f.seq,
    offset: f.time_offset,
    duration: f.duration,
    filename: f.name,
    path: path.join(config.path, f.name),
    // TODO
    status: SegmentDownloadedStatus.DONE,
  };
  logger.trace({ msg }, 'SegmentDownloadMessage');

  await sendData(config.outputTopic, {
    key: recording.channel + '-' + recording.id,
    value: JSON.stringify(msg),
    timestamp: new Date().getTime().toString(),
  });
}

const plMsg: PlaylistMessage = {
  type: PlaylistMessageType.END,
  user: recording.channel,
  id: recording.site_id,
  recordingId: recording.id,
};

logger.trace({ msg: plMsg }, 'playlist done');
await sendData(config.outputTopic, {
  key: recording.channel + '-' + recording.id,
  value: JSON.stringify(plMsg),
  timestamp: new Date().getTime().toString(),
});

await producer.disconnect();
await closePostgres();

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
