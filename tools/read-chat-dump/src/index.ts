import fs from 'fs';
import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { parse as parseIRC, IRCMessage as ParsedMessage } from 'irc-message-ts';
import type { IRCMessage } from '@twitch-archiving/messages';
import { initLogger } from '@twitch-archiving/utils';
import lineReader from 'line-reader';
import { send } from 'process';
import { time } from 'console';

interface PlaylistConfig {
  outputTopic: string;
  files: string[];
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  outputTopic: { type: String, defaultValue: 'tw-chat' },
  files: { type: String, multiple: true },
};

interface Config extends PlaylistConfig, KafkaConfig, FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...PlaylistConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('read-chat-dump');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

const producer: Producer = kafka.producer();
await producer.connect();

for (let i = 0; i < config.files.length; ++i) {
  lineReader.eachLine(config.files[i], async (line: string) => {
    // remove date from beginning of line
    // 2022-07-08T19:10:21.277Z
    line = line.substring(line.indexOf(' ') + 1);
    const result: ParsedMessage | null = parseIRC(line);
    if (result === null) return;
    const channel = result.params[0];
    if (!channel) return;
    if (channel.length === 0) return;
    const ircMessage: IRCMessage = {
      raw: line,
      command: result.command !== null ? result.command : '',
      prefix: result.prefix !== null ? result.prefix : '',
      params: [...result.params],
      tags: { ...result.tags },
    };
    const time = new Date(parseInt(result.tags['tmi-sent-ts']));
    await sendData(config.outputTopic, {
      key: channel.substring(1),
      value: JSON.stringify(ircMessage),
      timestamp: time.getTime().toString(),
    });
  });
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
