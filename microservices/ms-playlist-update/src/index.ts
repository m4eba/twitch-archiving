import {
  KafkaConfig,
  KafkaConfigOpt,
  RedisConfig,
  RedisConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import pino, { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import fetch from 'node-fetch';
import HLS from 'hls-parser';
import { createClient } from 'redis';
import type {
  PlaylistMessage,
  PlaylistSegmentMessage,
} from '@twitch-archiving/messages';

interface PlaylistConfig {
  inputTopic: string;
  outputTopic: string[];
  redisPrefix: string;
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  inputTopic: { type: String, multiple: true },
  outputTopic: { type: String, multiple: true },
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

const logger: Logger = pino({ level: 'debug' }).child({
  module: 'playlist-update',
});

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

const redis: ReturnType<typeof createClient> = createClient({
  url: config.redisUrl,
});

await redis.connect();

logger.info({ topic: config.inputTopic }, 'subscribe');

const consumer: Consumer = kafka.consumer({ groupId: 'websocket-dump' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ message }) => {
    if (!message.key) return;
    const user = message.key.toString();
    const playlistData = await redis.get(config.redisPrefix + user);
    if (playlistData === null) return;
    const playlist: PlaylistMessage = JSON.parse(playlistData);
    if (playlist === null) return;
    const resp = await fetch(playlist.url);
    const data = await resp.text();
    const list: HLS.types.MediaPlaylist = HLS.parse(
      data
    ) as HLS.types.MediaPlaylist;

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
        timestamp: new Date().toString(),
      });
    }
  },
});

async function sendData(topic: string[], msg: Message): Promise<void> {
  const messages: TopicMessages[] = [];
  for (let i: number = 0; i < topic.length; ++i) {
    const topicMessage: TopicMessages = {
      topic: topic[i],
      messages: [msg],
    };
    messages.push(topicMessage);
  }
  logger.debug({ topic: topic, size: messages.length }, 'sending batch');
  await producer.sendBatch({ topicMessages: messages });
}
