import {
  KafkaConfig,
  KafkaConfigOpt,
  RedisConfig,
  RedisConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { initLogger } from '@twitch-archiving/utils';
import { initRedis, download as dl } from '@twitch-archiving/database';

interface PlaylistUpdateTimerConfig {
  interval: number;
  outputTopic: string;
  redisPrefix: string;
}

const PlaylistUpdateTimerConfigOpt: ArgumentConfig<PlaylistUpdateTimerConfig> =
  {
    interval: { type: Number, defaultValue: 2000 },
    outputTopic: { type: String, defaultValue: 'tw-playlist-request' },
    redisPrefix: { type: String, defaultValue: 'tw-playlist-live-' },
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

const logger: Logger = initLogger('playlist-update-time');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initRedis(config, config.redisPrefix);

const producer: Producer = kafka.producer();
await producer.connect();

setInterval(async () => {
  const channels = await dl.getRecordedChannels();
  logger.trace({ channels }, 'channels');
  const messages: Message[] = [];
  for (let i = 0; i < channels.length; ++i) {
    messages.push({
      key: channels[i],
      value: null,
      timestamp: new Date().getTime().toString(),
    });
  }
  await sendData(config.outputTopic, messages);
}, config.interval);

async function sendData(topic: string, msg: Message[]): Promise<void> {
  const messages: TopicMessages[] = [];
  const topicMessage: TopicMessages = {
    topic,
    messages: msg,
  };
  messages.push(topicMessage);

  logger.debug({ topic: topic, size: messages.length }, 'sending batch');
  await producer.sendBatch({ topicMessages: messages });
}
