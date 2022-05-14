import {
  KafkaConfig,
  KafkaConfigOpt,
  RedisConfig,
  RedisConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import pino, { Logger } from 'pino';
import { Kafka, Producer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { createClient } from 'redis';

interface PlaylistUpdateTimerConfig {
  interval: number;
  outputTopic: string[];
  redisSetName: string;
}

const PlaylistUpdateTimerConfigOpt: ArgumentConfig<PlaylistUpdateTimerConfig> =
  {
    interval: { type: Number, defaultValue: 2000 },
    outputTopic: { type: String, multiple: true },
    redisSetName: { type: String, defaultValue: 'tw-playlist-live' },
  };

interface Config
  extends PlaylistUpdateTimerConfig,
    KafkaConfig,
    RedisConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...PlaylistUpdateTimerConfigOpt,
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

const producer: Producer = kafka.producer();
await producer.connect();

setInterval(async () => {
  const channels = await redis.sMembers(config.redisSetName);
  const messages: Message[] = [];
  for (let i = 0; i < channels.length; ++i) {
    messages.push({
      key: channels[i],
      value: null,
      timestamp: new Date().toString(),
    });
  }
  await sendData(config.outputTopic, messages);
}, config.interval);

async function sendData(topic: string[], msg: Message[]): Promise<void> {
  const messages: TopicMessages[] = [];
  for (let i: number = 0; i < topic.length; ++i) {
    const topicMessage: TopicMessages = {
      topic: topic[i],
      messages: msg,
    };
    messages.push(topicMessage);
  }
  logger.debug({ topic: topic, size: messages.length }, 'sending batch');
  await producer.sendBatch({ topicMessages: messages });
}