import {
  KafkaConfig,
  KafkaConfigOpt,
  TwitchConfig,
  TwitchConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, TopicMessages } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import {
  ClientCredentialsAuthProvider,
  AuthProvider,
  AccessToken,
} from '@twurple/auth';
import { ApiClient, HelixUser } from '@twurple/api';
import { Connection } from '@twitch-archiving/pubsub';
import { initLogger } from '@twitch-archiving/utils';

interface PubsubConfig {
  topics: string[];
  channels: string[];
  kafkaTopic: string;
}

const PubsubConfigOpt: ArgumentConfig<PubsubConfig> = {
  topics: { type: String, multiple: true },
  channels: { type: String, multiple: true },
  kafkaTopic: { type: String, defaultValue: 'tw-pubsub-events' },
};

interface Config extends PubsubConfig, KafkaConfig, TwitchConfig, FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...PubsubConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('pubsub-client');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});
const producer: Producer = kafka.producer();
await producer.connect();

const authProvider: AuthProvider = new ClientCredentialsAuthProvider(
  config.twitchClientId,
  config.twitchClientSecret
);

const twitch: ApiClient = new ApiClient({ authProvider });

const token: AccessToken | null = await authProvider.getAccessToken();
if (token === null) {
  logger.debug({ clientId: config.twitchClientId }, 'unable to authenticate');
  process.exit(1);
}

for (let i: number = 0; i < config.channels.length; ++i) {
  logger.debug({ channel: config.channels[i] }, 'create new connection');
  const user: HelixUser | null = await twitch.users.getUserByName(
    config.channels[i]
  );
  if (user === null) continue;
  const topics: string[] = config.topics.map((t) => t.replace('$ID', user.id));
  logger.debug({ topics: topics }, 'channel topics');
  const connection: Connection = new Connection(token.accessToken, topics);

  connection.addListener({
    message: (data: string) => {
      sendData(user.name, data).catch((e) => {
        logger.debug({ error: e }, 'error while sending');
      });
    },
  });
  connection.open();
}

async function sendData(user: string, data: string): Promise<void> {
  const time: Date = new Date();
  const messages: TopicMessages[] = [];
  const topicMessage: TopicMessages = {
    topic: config.kafkaTopic,
    messages: [
      {
        key: user,
        value: data,
        timestamp: time.getTime().toString(),
      },
    ],
  };
  messages.push(topicMessage);

  logger.debug({ id: user, size: messages.length }, 'sending batch');
  logger.trace({ id: user, messages }, 'sending messages');
  await producer.sendBatch({ topicMessages: messages });
}
