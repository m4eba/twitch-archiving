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
import { createClient } from 'redis';
import {
  getLivePlaylist,
  getAccessToken,
  AccessToken,
} from '@twitch-archiving/twitch';
import {
  PlaylistMessage,
  PlaylistType,
  RecordingStartedMessage,
} from '@twitch-archiving/messages';
import {
  initPostgres,
  initRedis,
  startRecording,
  createTableDownload,
  isRecording,
  setPlaylistMessage,
  getPlaylistMessage,
  stopRecording,
} from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';

interface PlaylistConfig {
  inputTopic: string;
  playlistOutputTopic: string;
  recordingOutputTopic: string;
  oauthVideo: string;
  redisPrefix: string;
  redisSetName: string;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-live' },
  playlistOutputTopic: { type: String, defaultValue: 'tw-playlist' },
  recordingOutputTopic: { type: String, defaultValue: 'tw-recording' },
  oauthVideo: { type: String, defaultValue: '' },
  redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
  redisSetName: { type: String, defaultValue: 'tw-playlist-live' },
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

const redis: ReturnType<typeof createClient> = createClient({
  url: config.redisUrl,
});

await initPostgres(config);
await initRedis(config, config.redisPrefix);
await createTableDownload();
await redis.connect();

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({ groupId: 'paylist-live' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ message }) => {
    if (!message.key) return;
    const user = message.key.toString();
    logger.debug({ user }, 'received msg');
    let init = false;
    let newStream = false;
    if (message.value) {
      const event: {
        forceReload?: boolean;
        data?: { topic: string; message: string };
      } = JSON.parse(message.value.toString());
      logger.trace({ event }, 'message event');
      if (event.forceReload !== undefined && event.forceReload === true) {
        logger.debug('forceReload message', { user, msg: event });
        init = true;
      }
      if (
        event.data !== undefined &&
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

    if (!(await isRecording(user))) {
      logger.debug('member not in redis', { user });
      init = true;
    }

    if (init) {
      await initStream(user, newStream);
    }
  },
});

async function initStream(user: string, newStream: boolean): Promise<void> {
  const token: AccessToken = await getAccessToken(
    {
      isLive: true,
      isVod: false,
      login: user,
      playerType: '',
      vodID: '',
    },
    config.oauthVideo
  );
  logger.trace({ user, token }, 'access token');
  const playlist = await getLivePlaylist(user, token);

  if (playlist.length === 0) {
    return;
  }

  logger.trace({ user, playlist }, 'playlist');

  const playlistMessage = await getPlaylistMessage(user);

  const reg = /BROADCAST-ID="(.*?)"/;
  let id = '';
  const regResult = reg.exec(playlist);
  if (regResult) {
    id = regResult[1].toString();
    logger.debug({ user, id }, 'broadcast-id in playlist');
  } else {
    // id is empty - twitch changed something
    // look for id in playlistmessage
    if (playlistMessage === undefined || newStream) {
      id = user + '-' + new Date().toISOString();
    } else {
      id = playlistMessage.id;
    }
    logger.debug({ user, id }, 'set id from date');
  }

  const list: HLS.types.MasterPlaylist = HLS.parse(
    playlist
  ) as HLS.types.MasterPlaylist;

  const best: HLS.types.Variant = list.variants.reduce((prev, curr) => {
    let result = prev;
    if (prev.bandwidth < curr.bandwidth) {
      result = curr;
    }
    logger.debug('best format', { user, url: result });
    return result;
  });

  const data: PlaylistMessage = {
    user,
    id,
    recordingId: '',
    type: PlaylistType.LIVE,
    playlist,
    token,
    url: best.uri,
  };

  let recordingId = '';
  const site_id = 'live-' + id;
  logger.trace({ user, id, site_id }, 'site_id');

  if (playlistMessage !== undefined && newStream) {
    recordingId = playlistMessage.recordingId;
    if (recordingId.length !== 0) {
      logger.debug({ recordingId, user }, 'stop running recording');
      await stopRecording(new Date(), recordingId);
    }
  }
  if (playlistMessage === undefined || newStream) {
    logger.debug({ data, user }, 'start new recording');
    recordingId = await startRecording(new Date(), user, site_id);
    data.recordingId = recordingId;
    const recMsg: RecordingStartedMessage = {
      user,
      id,
      recordingId,
      type: data.type,
    };
    await sendData(config.recordingOutputTopic, {
      key: user,
      value: JSON.stringify(recMsg),
      timestamp: new Date().getTime().toString(),
    });
  }

  await setPlaylistMessage(data);

  logger.debug('playlist', { user, playlistMessage: data });
  const msg = JSON.stringify(data);

  await sendData(config.playlistOutputTopic, {
    key: user,
    value: msg,
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
