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
  PlaylistMessage,
  PlaylistType,
  RecordingStartedMessage,
  AccessToken,
  RecordingMessageType,
  PlaylistRequestMessage,
  PlaylistMessageType,
} from '@twitch-archiving/messages';
import {
  initPostgres,
  initRedis,
  download as dl,
} from '@twitch-archiving/database';
import { initLogger, sleep } from '@twitch-archiving/utils';

interface PlaylistConfig {
  inputTopic: string;
  playlistRequestOutputTopic: string;
  playlistOutputTopic: string;
  recordingOutputTopic: string;
  oauthVideo: string;
  redisPrefix: string;
  redisSetName: string;
  playlistMaxRetries: number;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-live' },
  playlistRequestOutputTopic: {
    type: String,
    defaultValue: 'tw-playlist-request',
  },
  playlistOutputTopic: { type: String, defaultValue: 'tw-playlist' },
  recordingOutputTopic: { type: String, defaultValue: 'tw-recording' },
  oauthVideo: { type: String, defaultValue: '' },
  redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
  redisSetName: { type: String, defaultValue: 'tw-playlist-live' },
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

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({ groupId: 'paylist-live' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ message, heartbeat }) => {
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

    const recording = await dl.getRunningRecording(user);
    if (recording === undefined) {
      logger.debug({ user }, 'no running recording for user');
      init = true;
    }

    if (init) {
      await initStream(user, newStream, recording, heartbeat);
    }
  },
});

async function initStream(
  user: string,
  newStream: boolean,
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

  // TODO
  // better handling if BROADCAST-ID is not set
  const reg = /BROADCAST-ID="(.*?)"/;
  let site_id = '';
  const regResult = reg.exec(playlist);
  if (regResult) {
    const streamId = regResult[1].toString();
    site_id = 'live-' + streamId;
    logger.debug({ user, site_id }, 'site_id in playlist');

    if (recording !== undefined) {
      if ('live-' + streamId !== recording.site_id) {
        await dl.stopRecording(new Date(), recording.id);
        recording = await dl.getRecordingBySiteId('live-' + streamId);
      }
    } else {
      recording = await dl.getRecordingBySiteId('live-' + streamId);
      if (recording !== undefined && (recording.stop !== null || stopped)) {
        await dl.resumeRecording(recording.id);
      }
    }
  } else {
    // id is empty - twitch changed something
    // look for id in playlistmessage
    if (recording === undefined || newStream) {
      site_id = user + '-' + new Date().toISOString();
    } else {
      site_id = recording.site_id;
    }
    logger.debug({ user, site_id }, 'set id from date');
  }

  const list: HLS.types.MasterPlaylist = HLS.parse(
    playlist
  ) as HLS.types.MasterPlaylist;

  const best: HLS.types.Variant = list.variants.reduce((prev, curr) => {
    let result = prev;
    if (prev.bandwidth < curr.bandwidth) {
      result = curr;
    }
    logger.debug({ user, url: result }, 'best format');
    return result;
  });

  const data: PlaylistRequestMessage = {
    user,
    id: site_id,
    recordingId: '',
    type: PlaylistType.LIVE,
    playlist,
    token,
    url: best.uri,
  };
  const recordingData: dl.RecordingData = {
    type: PlaylistType.LIVE,
    playlist,
    token,
    bestUrl: best.uri,
  };

  // do nothing if recording continues
  if (recording === undefined) {
    logger.debug({ data, user }, 'start new recording');
    const recordingId = await dl.startRecording(
      new Date(),
      user,
      site_id,
      recordingData
    );
    data.recordingId = recordingId;
    const recMsg: RecordingStartedMessage = {
      type: RecordingMessageType.STARTED,
      user,
      id: site_id,
      recordingId,
      playlistType: data.type,
    };
    await sendData(config.recordingOutputTopic, {
      key: user,
      value: JSON.stringify(recMsg),
      timestamp: new Date().getTime().toString(),
    });
    const plMsg: PlaylistMessage = {
      type: PlaylistMessageType.START,
      user,
      id: site_id,
      recordingId,
    };
    await sendData(config.playlistOutputTopic, {
      key: user,
      value: JSON.stringify(plMsg),
      timestamp: new Date().getTime().toString(),
    });
  } else {
    await dl.updateRecordingData(recording.id, recordingData);
  }

  logger.debug({ user, playlistMessage: data }, 'playlist');
  const msg = JSON.stringify(data);

  await sendData(config.playlistRequestOutputTopic, {
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
