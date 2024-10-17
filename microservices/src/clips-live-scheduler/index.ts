import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  TwitchConfigOpt,
  TwitchConfig,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import type { ClipsList } from '@twitch-archiving/messages';
import { env2arg, initLogger } from '@twitch-archiving/utils';
import { initPostgres } from '@twitch-archiving/database';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient, HelixStream } from '@twurple/api';

interface SchedulerConfig {
  interval: number;
  user: string[];
  outputTopic: string;
}

const SchedulerConfigOpt: ArgumentConfig<SchedulerConfig> = {
  interval: { type: Number, defaultValue: 10 * 60 },
  user: { type: String, multiple: true },
  outputTopic: { type: String, defaultValue: 'tw-clips-list' },
};

interface Config
  extends SchedulerConfig,
    KafkaConfig,
    PostgresConfig,
    TwitchConfig,
    FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...KafkaConfigOpt,
  ...PostgresConfigOpt,
  ...SchedulerConfigOpt,
  ...TwitchConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });
  const logger: Logger = initLogger('clips-live-scheduler');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
  });

  await initPostgres(config);

  const producer: Producer = kafka.producer();
  await producer.connect();

  const authProvider: ClientCredentialsAuthProvider =
    new ClientCredentialsAuthProvider(
      config.twitchClientId,
      config.twitchClientSecret
    );
  const apiClient: ApiClient = new ApiClient({ authProvider });

  async function testUser(user: string): Promise<void> {
    const accessToken = await authProvider.getAccessToken();
    const stream: HelixStream | null =
      await apiClient.streams.getStreamByUserName(user);
    logger.debug({ stream, user }, 'test user');
    if (stream !== null) {
      const msg: ClipsList = {
        channel: user,
        channel_id: stream.userId,
        start: stream.startDate.toISOString(),
        end: new Date().toISOString(),
        pagination: '',
        count: 0,
        accessToken: accessToken ? accessToken.accessToken : '',
      };
      await sendData(config.outputTopic, {
        key: user,
        value: JSON.stringify(msg),
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
  config.user.forEach((u) => testUser(u));

  setInterval(() => {
    config.user.forEach((u) => testUser(u));
  }, config.interval * 1000);
}
