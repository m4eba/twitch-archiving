import {
  KafkaConfig,
  KafkaConfigOpt,
  RedisConfig,
  RedisConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import fetch from 'node-fetch';
import HLS from 'hls-parser';
import type {
  PlaylistMessage,
  PlaylistSegmentMessage,
} from '@twitch-archiving/messages';
import { initLogger } from '@twitch-archiving/utils';
import {
  initRedis,
  getPlaylistMessage,
  setPlaylistEnding,
  getRecordingId,
} from '@twitch-archiving/database';

interface PlaylistConfig {
  inputTopic: string;
  outputTopic: string;
  redisPrefix: string;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-playlist' },
  outputTopic: { type: String, defaultValue: 'tw-playlist-segment' },
  redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
};

interface Config extends PlaylistConfig, KafkaConfig, RedisConfig, FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
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
    const playlist: PlaylistMessage | undefined = await getPlaylistMessage(
      user
    );
    if (playlist === undefined) return;
    const resp = await fetch(playlist.url);
    const data = await resp.text();
    const list: HLS.types.MediaPlaylist = HLS.parse(
      data
    ) as HLS.types.MediaPlaylist;

    if (list.endlist) {
      const recordingId = await getRecordingId(user);
      await setPlaylistEnding(recordingId);
    }

    for (let i = 0; i < list.segments.length; ++i) {
      const seg = list.segments[i];
      let time = '';
      if (seg.programDateTime) {
        time = seg.programDateTime.toISOString();
      } else {
        time = new Date().toISOString();
      }

      const msg: PlaylistSegmentMessage = {
        user,
        id: playlist.id,
        type: playlist.type,
        sequenceNumber: seg.mediaSequenceNumber,
        duration: seg.duration,
        time,
        url: seg.uri,
      };

      await sendData(config.outputTopic, {
        key: user,
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
