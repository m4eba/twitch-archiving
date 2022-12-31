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
  ITPlaylistParseMaster,
  OTPlaylistParseMaster,
  MasterPlaylistTextMessage,
  MasterPlaylistSourceType,
  MasterPlaylistRequestMessage,
} from '@twitch-archiving/messages';
import {
  initPostgres,
  initRedis,
  download as dl,
} from '@twitch-archiving/database';
import { initLogger, sleep } from '@twitch-archiving/utils';

interface PlaylistConfig {
  inputTopic: string;
  outputTopicPlaylistUpdate: string;
  outputTopicPlaylist: string;
  outputTopicRecording: string;
  outputTopicMasterPlaylistRequest: string;
  oauthVideo: string;
  redisPrefix: string;
  redisSetName: string;
  playlistMaxRetries: number;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: ITPlaylistParseMaster },
  outputTopicPlaylistUpdate: {
    type: String,
    defaultValue: OTPlaylistParseMaster.playlistUpdate,
  },
  outputTopicPlaylist: {
    type: String,
    defaultValue: OTPlaylistParseMaster.playlist,
  },
  outputTopicRecording: {
    type: String,
    defaultValue: OTPlaylistParseMaster.recording,
  },
  outputTopicMasterPlaylistRequest: {
    type: String,
    defaultValue: OTPlaylistParseMaster.masterPlaylistRequest,
  },
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

const logger: Logger = initLogger('paylist-parse-master');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initPostgres(config);
await initRedis(config, config.redisPrefix);
await dl.createTableDownload();

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({ groupId: 'paylist-parse-master' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ message }) => {
    if (!message.key) return;
    if (!message.value) return;
    const user = message.key.toString();
    const data: MasterPlaylistTextMessage = JSON.parse(
      message.value.toString()
    );
    logger.debug({ user, data }, 'received msg');

    await initStream(data);
  },
});

async function initStream(msg: MasterPlaylistTextMessage): Promise<void> {
  const playlist = msg.text;
  const user = msg.user;
  let recording = msg.id.length > 0 ? await dl.getRecording(msg.id) : undefined;
  const newStream = msg.source === MasterPlaylistSourceType.STREAM_UP_EVENT;

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
      if (recording !== undefined && recording.stop !== null) {
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
    let result: HLS.types.Variant = prev;
    if (prev.bandwidth < curr.bandwidth) {
      result = curr;
    }
    logger.debug({ user, url: result }, 'best format');
    return result;
  });

  const token: AccessToken = msg.token
    ? msg.token
    : {
        token: '',
        sig: '',
        expires_at: '',
      };

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
    await sendData(config.outputTopicRecording, {
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
    await sendData(config.outputTopicPlaylist, {
      key: user,
      value: JSON.stringify(plMsg),
      timestamp: new Date().getTime().toString(),
    });

    // new recording from extern instance
    // force an update on the master playlist
    if (data.token === undefined) {
      const req: MasterPlaylistRequestMessage = {
        user,
      };
      await sendData(config.outputTopicMasterPlaylistRequest, {
        key: user,
        value: JSON.stringify(req),
        timestamp: new Date().getTime().toString(),
      });
    }
  } else {
    // don't update if it is from extern instance
    if (data.token !== undefined) {
      await dl.updateRecordingData(recording.id, recordingData);
    }
  }

  logger.debug({ user, playlistMessage: data }, 'playlist');

  // since the url is not saved no point in forcing an update
  if (data.token !== undefined) {
    const update = JSON.stringify(data);

    await sendData(config.outputTopicPlaylistUpdate, {
      key: user,
      value: update,
      timestamp: new Date().getTime().toString(),
    });
  }
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
