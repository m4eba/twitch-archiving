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
  PlaylistMessage,
  PlaylistRequestMessage,
  RecordingEndedMessage,
  RecordingMessageType,
  RecordingSegmentMessage,
} from '@twitch-archiving/messages';
import {
  initLogger,
  fetchWithTimeoutText,
  env2arg,
} from '@twitch-archiving/utils';
import {
  initRedis,
  download as dl,
  initPostgres,
} from '@twitch-archiving/database';

interface PlaylistConfig {
  inputTopic: string;
  recordingOutputTopic: string;
  playlistReloadOutputTopic: string;
  redisPrefix: string;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-playlist-request' },
  recordingOutputTopic: { type: String, defaultValue: 'tw-recording' },
  playlistReloadOutputTopic: { type: String, defaultValue: 'tw-live' },
  redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
};

interface Config
  extends PlaylistConfig,
    KafkaConfig,
    PostgresConfig,
    RedisConfig,
    FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...KafkaConfigOpt,
  ...PostgresConfigOpt,
  ...PlaylistConfigOpt,
  ...RedisConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });
  const logger: Logger = initLogger('playlist-update');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
  });

  console.log('config', config);

  await initRedis(config, config.redisPrefix);
  await initPostgres(config);

  logger.info({ topic: config.inputTopic }, 'subscribe');

  const consumer: Consumer = kafka.consumer({ groupId: 'playlist-update' });
  await consumer.connect();
  await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

  const producer: Producer = kafka.producer();
  await producer.connect();

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.key) return;
      const user = message.key.toString();
      const recording = await dl.getRunningRecording(user);
      if (recording === undefined) {
        logger.debug({ user }, 'force reload - no recording');
        await forcePlaylistUpdate(user, 'recording undefined');
        return;
      }
      const playlist: dl.RecordingData | null = recording.data;
      logger.debug({ playlist, user }, 'playlist');
      if (playlist === null) {
        logger.debug({ user }, 'force reload - empty playlist');
        await forcePlaylistUpdate(user, 'playlist null');
        return;
      }
      logger.trace({ url: playlist.bestUrl, user }, 'fetch playlist');
      //const resp = await fetch(playlist.url);
      const { data, resp } = await fetchWithTimeoutText(
        playlist.bestUrl,
        3,
        2000
      );
      if (resp.status !== 200) {
        logger.debug({ code: resp.status }, 'invalid status code');
        await forcePlaylistUpdate(user, 'invalid status code');
        return;
      }
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
          playlistType: playlist.type,
          sequenceNumber: seg.mediaSequenceNumber,
          offset: offset,
          duration: seg.duration,
          time: time.toISOString(),
          url: seg.uri,
        };

        offset += seg.duration;

        await sendData(config.recordingOutputTopic, {
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
          playlistType: playlist.type,
          segmentCount: await dl.getFileCount(recording.id),
        };

        await sendData(config.recordingOutputTopic, {
          key: user + '-' + recording.id,
          value: JSON.stringify(msg),
          timestamp: new Date().getTime().toString(),
        });
      }
    },
  });

  async function forcePlaylistUpdate(user: string, msg: string): Promise<void> {
    await sendData(config.playlistReloadOutputTopic, {
      key: user,
      value: JSON.stringify({
        forceReload: true,
        msg,
      }),
      timestamp: new Date().getTime().toString(),
    });
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
}
