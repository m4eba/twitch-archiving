import {
  KafkaConfig,
  KafkaConfigOpt,
  RedisConfig,
  RedisConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import HLS from 'hls-parser';
import {
  ITPlaylistParse,
  ITPlaylistParseMaster,
  MasterPlaylistRequestMessage,
  OTPlaylistParse,
  PlaylistMessage,
  PlaylistRequestMessage,
  PlaylistTextMessage,
  PlaylistType,
  RecordingEndedMessage,
  RecordingMessageType,
  RecordingSegmentMessage,
} from '@twitch-archiving/messages';
import { initLogger, fetchWithTimeoutText } from '@twitch-archiving/utils';
import {
  initRedis,
  download as dl,
  initPostgres,
} from '@twitch-archiving/database';

interface PlaylistConfig {
  inputTopic: string;
  outputTopic: string;
  redisPrefix: string;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: ITPlaylistParse },
  outputTopic: {
    type: String,
    defaultValue: OTPlaylistParse,
  },
  redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
};

interface Config
  extends PlaylistConfig,
    KafkaConfig,
    PostgresConfig,
    RedisConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...PlaylistConfigOpt,
    ...RedisConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('playlist-parse');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initRedis(config, config.redisPrefix);
await initPostgres(config);

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({ groupId: 'playlist-parse' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ message }) => {
    if (!message.key) return;
    if (!message.value) return;
    const user = message.key.toString();
    const msg: PlaylistTextMessage = JSON.parse(message.value.toString());
    const recording = await dl.getRecording(msg.recordingId);
    if (recording === undefined) {
      logger.error({ msg }, 'recording not found');
      return;
    }
    const playlistType: PlaylistType = recording.data
      ? recording.data.type
      : PlaylistType.LIVE;

    const data: string = msg.text;
    logger.trace({ data }, 'playlist text');

    const list: HLS.types.MediaPlaylist = HLS.parse(
      data
    ) as HLS.types.MediaPlaylist;

    const latestFile = await dl.getLatestFile(recording.id);
    let offset = 0;
    if (latestFile !== undefined) {
      offset = latestFile.time_offset + latestFile.duration;
      logger.trace(
        {
          offset_type: typeof latestFile.time_offset,
          time_offset: latestFile.time_offset,
          duration_type: typeof latestFile.duration,
          duration: latestFile.duration,
        },
        'set offset'
      );
    }

    const segments = list.segments;

    for (let i = 0; i < segments.length; ++i) {
      const seg = segments[i];
      if (
        latestFile !== undefined &&
        seg.mediaSequenceNumber <= latestFile.seq
      ) {
        continue;
      }

      let time: Date;
      if (seg.programDateTime) {
        time = seg.programDateTime;
      } else {
        time = new Date();
      }

      const filename =
        seg.mediaSequenceNumber.toString().padStart(5, '0') + '.ts';
      await dl.addFile(
        recording.id,
        filename,
        seg.mediaSequenceNumber,
        offset,
        seg.duration,
        time
      );

      const msg: RecordingSegmentMessage = {
        type: RecordingMessageType.SEGMENT,
        user,
        id: recording.site_id,
        recordingId: recording.id,
        playlistType: playlistType,
        sequenceNumber: seg.mediaSequenceNumber,
        offset: offset,
        duration: seg.duration,
        time: time.toISOString(),
        url: seg.uri,
      };

      offset += seg.duration;

      await sendData(config.outputTopic, {
        key: user + '-' + recording.id,
        value: JSON.stringify(msg),
        timestamp: new Date().getTime().toString(),
      });
    }

    if (list.endlist) {
      await dl.stopRecording(new Date(), recording.id);

      const msg: RecordingEndedMessage = {
        type: RecordingMessageType.ENDED,
        user,
        id: recording.site_id,
        recordingId: recording.id,
        playlistType: playlistType,
        segmentCount: await dl.getFileCount(recording.id),
      };

      await sendData(config.outputTopic, {
        key: user + '-' + recording.id,
        value: JSON.stringify(msg),
        timestamp: new Date().getTime().toString(),
      });
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
