import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  TwitchConfig,
  TwitchConfigOpt,
  RedisConfig,
  RedisConfigOpt,
} from '@twitch-archiving/config';
import path from 'path';
import fs from 'fs';
import type { Logger } from 'pino';
import { Kafka, Consumer, Producer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { FileWriter } from '@twitch-archiving/utils';
import type { IRCMessage } from '@twitch-archiving/messages';
import { initRedis, chat } from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';
import {
  parseIrcMessageEmoteTag,
  seventv,
  bettertv,
  ffz,
  Emote,
} from '@twitch-archiving/chat';

interface UpdateConfig {
  topic: string;
  channelFile: string;
  interval: number;
  redisPrefix: string;
}

const UpdateConfigOpt: ArgumentConfig<UpdateConfig> = {
  topic: { type: String, defaultValue: 'tw-chat-emotes-updater' },
  channelFile: { type: String },
  interval: { type: Number, defaultValue: 30 * 60 },
  redisPrefix: { type: String, defaultValue: 'tw-chat-emotes' },
};

interface Config
  extends UpdateConfig,
    KafkaConfig,
    RedisConfig,
    TwitchConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...RedisConfigOpt,
    ...UpdateConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

await initRedis(config, config.redisPrefix);

const logger: Logger = initLogger('chat-emote-updater');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

const authProvider = new ClientCredentialsAuthProvider(
  config.twitchClientId,
  config.twitchClientSecret
);
const client = new ApiClient({ authProvider });

const channelSet: Map<string, string> = new Map();
await readChannels();

fs.watch(config.channelFile, readChannels);

const producer: Producer = kafka.producer();
await producer.connect();

await update();
setInterval(update, config.interval * 1000);

async function update(): Promise<void> {
  const msg: Message[] = [];

  let global: Emote[] = [];
  {
    const { data, emotes } = await seventv.globalEmotes();
    global = global.concat(emotes);
  }
  {
    const { data, emotes } = await bettertv.globalEmotes();
    global = global.concat(emotes);
  }
  await chat.setGlobalEmotes(global);
  logger.trace({ global }, 'global emotes received');

  await channelSet.forEach(async (id, channel) => {
    let ce: Emote[] = [];
    {
      const { data, emotes } = await bettertv.channelEmotes(id);
      ce = ce.concat(emotes);
    }
    {
      const { data, emotes } = await seventv.channelEmotes(channel);
      ce = ce.concat(emotes);
    }
    {
      const { data, emotes } = await ffz.channelEmotes(channel);
      ce = ce.concat(emotes);
    }
    await chat.setChannelEmotes(channel, ce);

    logger.trace({ channel, emotes: ce }, 'channel emotes received');
    msg.push({
      key: channel,
      value: JSON.stringify({ emotes: ce, global }),
      timestamp: new Date().getTime().toString(),
    });
  });

  await sendData(config.topic, msg);
}

async function readChannels(): Promise<void> {
  const content = await fs.promises.readFile(config.channelFile, {
    encoding: 'utf8',
  });
  const channels = content.split('\n');
  logger.trace({ channels }, 'channels');

  channels.forEach(async (v) => {
    const split = v.split(' ');
    const username = split[0];
    const id = split[1];
    channelSet.set(username, id);
  });
}

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
