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
import { Connection } from '@twitch-archiving/chat';
import type { IRCMessage } from '@twitch-archiving/messages';
import { env2arg, initLogger } from '@twitch-archiving/utils';
import fs from 'fs';

interface ChatConfig {
  username: string;
  oauth: string;
  channelFile: string;
  topic: string;
}

const ChatConfigOpt: ArgumentConfig<ChatConfig> = {
  username: { type: String },
  oauth: { type: String },
  channelFile: { type: String },
  topic: { type: String, defaultValue: 'tw-chat' },
};

interface Config extends ChatConfig, KafkaConfig, TwitchConfig, FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...KafkaConfigOpt,
  ...ChatConfigOpt,
  ...TwitchConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });

  const logger: Logger = initLogger('chat-client');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
    retry: {
      retries: 100,
    },
  });
  const producer: Producer = kafka.producer();
  await producer.connect();

  const connection: Connection = new Connection(config.username, config.oauth);

  const channelSet: Set<string> = new Set();

  connection.addListener({
    message: (data: IRCMessage) => {
      if (data.params.length === 0) return;
      const channel = data.params[0];
      if (channel.length === 0) return;
      const name = channel.substring(1);
      if (!channelSet.has(name)) return;
      sendData(name, JSON.stringify(data)).catch((e) => {
        logger.debug({ error: e }, 'error while sending');
      });
    },
  });
  await connection.open();
  await readChannels();

  fs.watch(config.channelFile, readChannels);

  async function sendData(user: string, data: string): Promise<void> {
    const time: Date = new Date();
    const messages: TopicMessages[] = [];
    const topicMessage: TopicMessages = {
      topic: config.topic,
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
    await producer.sendBatch({ topicMessages: messages });
  }

  async function readChannels(): Promise<void> {
    const content = await fs.promises.readFile(config.channelFile, {
      encoding: 'utf8',
    });
    const channels = content.split('\n');
    const newc: string[] = [];
    const partSet: Set<string> = new Set(channelSet);

    channels.forEach((v) => {
      partSet.delete(v);
      if (channelSet.has(v)) return;
      newc.push(v);
      channelSet.add(v);
    });
    await connection.part(Array.from(partSet));
    await connection.join(newc);
  }
}
