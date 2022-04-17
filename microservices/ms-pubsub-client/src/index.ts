import {
  KafkaConfig,
  KafkaConfigOpt,
  TwitchConfig,
  TwitchConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import pino, { Logger } from 'pino';
import { Kafka, Producer, TopicMessages } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import {
  ClientCredentialsAuthProvider,
  AuthProvider,
  AccessToken,
} from '@twurple/auth';
import { ApiClient, HelixUser } from '@twurple/api';
import { Connection } from '@twitch-archiving/pubsub';
import type { WebsocketMessage } from '@twitch-archiving/messages';

interface PubsubConfig {
  topics: string[];
  channels: string[];
  kafkaTopics: string[];
}

const PubsubConfigOpt: ArgumentConfig<PubsubConfig> = {
  topics: { type: String, multiple: true },
  channels: { type: String, multiple: true },
  kafkaTopics: { type: String, multiple: true },
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

const logger: Logger = pino({ level: 'debug' }).child({
  module: 'pubsub-client',
});

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
  const user: HelixUser | null = await twitch.users.getUserByName(
    config.channels[i]
  );
  if (user === null) continue;
  const topics: string[] = config.topics.map((t) => t.replace('$ID', user.id));
  const connection: Connection = new Connection(token.accessToken, topics);
  connection.addListener({
    message: (data: string) => {
      sendData(user.name, data).catch((e) => {
        logger.debug({ error: e }, 'error while sending');
      });
    },
  });
}

async function sendData(user: string, data: string): Promise<void> {
  const time: Date = new Date();
  const messages: TopicMessages[] = [];
  for (let i: number = 0; i < config.kafkaTopics.length; ++i) {
    const value: WebsocketMessage = {
      id: user,
      data: data.toString().trim(),
    };
    const topicMessage: TopicMessages = {
      topic: config.kafkaTopics[i],
      messages: [
        {
          key: user,
          value: JSON.stringify(value),
          timestamp: time.getTime().toString(),
        },
      ],
    };
    messages.push(topicMessage);
  }
  logger.debug({ id: user, size: messages.length }, 'sending batch');
  await producer.sendBatch({ topicMessages: messages });
}
