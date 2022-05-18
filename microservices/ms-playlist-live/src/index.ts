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
import { PlaylistMessage, PlaylistType } from '@twitch-archiving/messages';
import { init, startRecording } from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';

interface PlaylistConfig {
  inputTopic: string;
  outputTopic: string;
  oauthVideo: string;
  redisPrefix: string;
  redisSetName: string;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-pubsub-events' },
  outputTopic: { type: String, defaultValue: 'tw-playlist' },
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

await init(config);
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
    let init = false;
    if (message.value) {
      const event: {
        forceReload?: boolean;
        topic?: string;
        message?: string;
      } = JSON.parse(message.value.toString());
      if (event.forceReload !== undefined && event.forceReload === true)
        logger.debug('forceReload message', { user, msg: event });
      init = true;
      if (
        event.topic !== undefined &&
        event.message !== undefined &&
        event.topic.toString().startsWith('video-playback-by-id')
      ) {
        const msg: { type?: string } = JSON.parse(event.message);
        if (msg.type !== undefined && msg.type === 'stream-up') {
          logger.debug('stream-up msesage', { user, msg: event });
          init = true;
        }
      }
    }
    if (!(await redis.sIsMember(config.redisSetName, user))) {
      logger.debug('member not in redis', { user });
      init = true;
    }
    if (init) {
      await initStream(user);
    }
  },
});

async function initStream(user: string): Promise<void> {
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
  const playlist = await getLivePlaylist(user, token);

  const reg = /BROADCAST-ID="(.*?)"/;
  let id = '';
  const regResult = reg.exec(playlist);
  if (regResult) {
    id = regResult[1].toString();
  } else {
    id = user + '-' + new Date().toISOString();
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
    type: PlaylistType.LIVE,
    playlist,
    token,
    url: best.uri,
  };

  logger.debug('playlist', { user, playlistMessage: data });
  const msg = JSON.stringify(data);

  const recordingId = await startRecording(new Date(), user, 'live-' + id);

  await redis.set(config.redisPrefix + user, msg);
  await redis.set(config.redisPrefix + user + '-recordingId', recordingId);
  await redis.sAdd(config.redisSetName, user);

  await sendData(config.outputTopic, {
    key: user,
    value: msg,
    timestamp: new Date().toString(),
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
