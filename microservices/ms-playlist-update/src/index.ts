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
  ITPlaylistUpdate,
  MasterPlaylistRequestMessage,
  OTPlaylistUpdate,
  PlaylistMessage,
  PlaylistRequestMessage,
  PlaylistTextMessage,
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
  outputTopicPlaylistText: string;
  outputTopicMasterPlaylistRequest: string;
  redisPrefix: string;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: ITPlaylistUpdate },
  outputTopicPlaylistText: {
    type: String,
    defaultValue: OTPlaylistUpdate.playlistText,
  },
  outputTopicMasterPlaylistRequest: {
    type: String,
    defaultValue: OTPlaylistUpdate.masterPlaylistRequest,
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

const logger: Logger = initLogger('playlist-update');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

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
      await forcePlaylistUpdate(user);
      return;
    }
    const playlist: dl.RecordingData | null = recording.data;
    logger.debug({ playlist, user }, 'playlist');
    if (playlist === null) {
      await forcePlaylistUpdate(user);
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
      await forcePlaylistUpdate(user);
      return;
    }
    logger.trace({ data }, 'playlist text');

    const msg: PlaylistTextMessage = {
      id: recording.site_id,
      recordingId: recording.id,
      text: data,
      user,
    };

    await sendData(config.outputTopicPlaylistText, {
      key: user + '-' + recording.id,
      value: JSON.stringify(msg),
      timestamp: new Date().getTime().toString(),
    });
  },
});

async function forcePlaylistUpdate(user: string): Promise<void> {
  const req: MasterPlaylistRequestMessage = {
    user,
  };
  await sendData(config.outputTopicMasterPlaylistRequest, {
    key: user,
    value: JSON.stringify(req),
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
