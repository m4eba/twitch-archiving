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
import HLS from 'hls-parser';
import { getLivePlaylist, getAccessToken } from '@twitch-archiving/twitch';
import {
  ITPlaylistGetLive,
  OTPlaylistGetLive,
  PlaylistMessage,
  PlaylistType,
  RecordingStartedMessage,
  AccessToken,
  RecordingMessageType,
  PlaylistRequestMessage,
  PlaylistMessageType,
  PlaylistTextMessage,
  MasterPlaylistTextMessage,
  MasterPlaylistSourceType,
} from '@twitch-archiving/messages';
import {
  initPostgres,
  initRedis,
  download as dl,
} from '@twitch-archiving/database';
import { initLogger, sleep } from '@twitch-archiving/utils';

interface PlaylistConfig {
  inputTopicEvents: string;
  inputTopicRequest: string;
  outputTopicMasterPlaylistText: string;
  oauthVideo: string;
  redisPrefix: string;
  redisSetName: string;
  playlistMaxRetries: number;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopicEvents: { type: String, defaultValue: ITPlaylistGetLive.events },
  inputTopicRequest: { type: String, defaultValue: ITPlaylistGetLive.request },
  outputTopicMasterPlaylistText: {
    type: String,
    defaultValue: OTPlaylistGetLive.masterPlaylistText,
  },
  oauthVideo: { type: String, defaultValue: '' },
  redisPrefix: { type: String, defaultValue: 'tw-playlist-get-live-' },
  redisSetName: { type: String, defaultValue: 'tw-playlist-get-live' },
  playlistMaxRetries: { type: Number, defaultValue: 30 },
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

const logger: Logger = initLogger('paylist-live');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initPostgres(config);
await initRedis(config, config.redisPrefix);
await dl.createTableDownload();

logger.info(
  {
    topicEvents: config.inputTopicEvents,
    topicRequest: config.inputTopicRequest,
  },
  'subscribe'
);

const producer: Producer = kafka.producer();
await producer.connect();

const consumerRequest: Consumer = kafka.consumer({
  groupId: 'paylist-get-live',
});
await consumerRequest.connect();
await consumerRequest.subscribe({
  topic: config.inputTopicEvents,
  fromBeginning: true,
});

await consumerRequest.run({
  eachMessage: async ({ message, heartbeat }) => {
    if (!message.key) return;
    const user = message.key.toString();
    const recording = await dl.getRunningRecording(user);
    if (recording === undefined) {
      logger.debug({ user }, 'no running recording for user');
    }

    await initStream(
      user,
      MasterPlaylistSourceType.REQUEST,
      recording,
      heartbeat
    );
  },
});

const consumerEvents: Consumer = kafka.consumer({
  groupId: 'paylist-get-live',
});
await consumerEvents.connect();
await consumerEvents.subscribe({
  topic: config.inputTopicEvents,
  fromBeginning: true,
});

await consumerEvents.run({
  eachMessage: async ({ message, heartbeat }) => {
    if (!message.key) return;
    const user = message.key.toString();
    logger.debug({ user }, 'received msg');
    let init = false;
    let newStream = false;
    if (message.value) {
      const event: {
        data: { topic: string; message: string };
      } = JSON.parse(message.value.toString());
      logger.trace({ event }, 'message event');

      if (
        event.data.topic !== undefined &&
        event.data.message !== undefined &&
        event.data.topic.toString().startsWith('video-playback-by-id')
      ) {
        const msg: { type?: string } = JSON.parse(event.data.message);
        if (msg.type !== undefined && msg.type === 'stream-up') {
          logger.debug('stream-up msesage', { user, msg: event });
          init = true;
          newStream = true;
        }
      }
    }

    const recording = await dl.getRunningRecording(user);
    if (recording === undefined) {
      logger.debug({ user }, 'no running recording for user');
      init = true;
    }

    if (init) {
      await initStream(
        user,
        newStream
          ? MasterPlaylistSourceType.STREAM_UP_EVENT
          : MasterPlaylistSourceType.EVENT,
        recording,
        heartbeat
      );
    }
  },
});

async function initStream(
  user: string,
  source: MasterPlaylistSourceType,
  recording: dl.Recording | undefined,
  heartbeat: () => Promise<void>
): Promise<void> {
  let tries = 0;

  let token: AccessToken | undefined;
  let playlist: string = '';
  let stopped = false;

  while (tries < config.playlistMaxRetries) {
    try {
      token = await getAccessToken(
        {
          isLive: true,
          isVod: false,
          login: user,
          playerType: '',
          vodID: '',
        },
        config.oauthVideo
      );
      logger.trace({ tries, user, token }, 'access token');
      playlist = await getLivePlaylist(user, token);
    } catch (e) {
      logger.trace({ error: e }, 'error getting playlist');
    }

    if (playlist.length === 0) {
      logger.trace({ user }, 'playlist empty');
      if (recording !== undefined && !stopped) {
        await dl.stopRecording(new Date(), recording.id);
        stopped = true;
      }
      await heartbeat();
      await sleep(1000);
      tries++;
    } else {
      break;
    }
  }

  if (playlist.length === 0) {
    logger.error(token, 'no playlist found');
    return;
  }

  if (token === undefined) {
    logger.error({ user, token }, 'token is undefined');
    return;
  }

  logger.trace({ user, playlist }, 'playlist');

  const msg: MasterPlaylistTextMessage = {
    user,
    id: '',
    text: playlist,
    recordingId: recording ? recording.id : '',
    source,
    token,
  };
  await sendData(config.outputTopicMasterPlaylistText, {
    key: user,
    value: JSON.stringify(msg),
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
