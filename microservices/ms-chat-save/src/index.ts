import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  RedisConfigOpt,
  RedisConfig,
} from '@twitch-archiving/config';
import path from 'path';
import type { Logger } from 'pino';
import { Kafka, Consumer } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { FileWriter } from '@twitch-archiving/utils';
import type { IRCMessage } from '@twitch-archiving/messages';
import { initPostgres, initRedis, chat } from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';
import {
  parseIrcMessageEmoteTag,
  EmoteData,
  Emote,
  Resolver,
} from '@twitch-archiving/chat';

interface DumpConfig {
  chatTopic: string;
  emoteTopic: string;
  redisPrefix: string;
}

const DumpConfigOpt: ArgumentConfig<DumpConfig> = {
  chatTopic: { type: String, defaultValue: 'tw-chat' },
  emoteTopic: { type: String, defaultValue: 'tw-chat-emotes-updater' },
  redisPrefix: { type: String, defaultValue: 'tw-chat-emotes' },
};

interface Config
  extends DumpConfig,
    RedisConfig,
    KafkaConfig,
    PostgresConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...RedisConfigOpt,
    ...DumpConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('chat-save');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initRedis(config, config.redisPrefix);
await initPostgres(config);
await chat.createTable();

const resolver = new Resolver();
resolver.setGlobal(await chat.getGlobalEmotes());

const consumerE: Consumer = kafka.consumer({
  groupId: 'chat-save-emote-updater',
});
await consumerE.connect();
await consumerE.subscribe({ topic: config.emoteTopic, fromBeginning: true });

await consumerE.run({
  eachMessage: async ({ message }) => {
    if (message.value && message.key) {
      const msg = JSON.parse(message.value.toString());
      const channel = message.key.toString();
      resolver.setEmotes(channel, msg.emotes);
      resolver.setGlobal(msg.global);
    }
  },
});

const consumer: Consumer = kafka.consumer({ groupId: 'chat-save' });
await consumer.connect();
await consumer.subscribe({ topic: config.chatTopic, fromBeginning: true });

await consumer.run({
  eachMessage: async ({ message }) => {
    if (message.value && message.key) {
      logger.info(
        {
          message: JSON.parse(message.value.toString()),
        },
        'msg received'
      );

      const irc: IRCMessage = JSON.parse(message.value.toString());
      if (irc.command !== 'PRIVMSG') return;
      const username = irc.prefix.substring(0, irc.prefix.indexOf('!'));
      if (irc.params.length < 2) return;
      const text = irc.params[1].trim();
      const channel = irc.params[0].substring(1);
      let emotes = parseIrcMessageEmoteTag(text, irc.tags['emotes']);

      if (!resolver.hasEmotes(channel)) {
        resolver.setEmotes(channel, await chat.getChannelEmotes(channel));
      }
      emotes = emotes.concat(resolver.resolve(channel, text));

      logger.trace({ text, emotes, channel }, 'text with emotes');
      const msg: chat.ChatMessage = {
        id: irc.tags['id'],
        channel,
        username,
        message: text,
        time: new Date(parseInt(irc.tags['tmi-sent-ts'])),
        data: irc.tags,
        emotes,
      };
      await chat.insertMessage(msg);
    }
  },
});
