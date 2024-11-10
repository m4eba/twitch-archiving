import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import path from 'path';
import type { Logger } from 'pino';
import { Kafka, Consumer } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { FileWriter, env2arg } from '@twitch-archiving/utils';
import type { IRCMessage } from '@twitch-archiving/messages';
import { initLogger } from '@twitch-archiving/utils';

interface DumpConfig {
  topic: string;
  outputPath: string;
}

const DumpConfigOpt: ArgumentConfig<DumpConfig> = {
  topic: { type: String, defaultValue: 'tw-chat' },
  outputPath: { type: String },
};

interface Config extends DumpConfig, KafkaConfig, FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...KafkaConfigOpt,
  ...DumpConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });
  const logger: Logger = initLogger('chat-dump');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
    retry: {
      retries: 100,
    },
  });

  logger.info({ topic: config.topic }, 'subscribe');
  const consumer: Consumer = kafka.consumer({ groupId: 'chat-dump' });
  await consumer.connect();
  await consumer.subscribe({ topic: config.topic, fromBeginning: true });

  const out: Map<string, FileWriter> = new Map();

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value && message.key) {
        logger.info(
          {
            message: JSON.parse(message.value.toString()),
          },
          'msg received'
        );
        const key = message.key.toString();
        let o: FileWriter | undefined = out.get(key);
        if (o === undefined) {
          o = new FileWriter(path.join(config.outputPath, key));
          out.set(key, o);
        }
        const irc: IRCMessage = JSON.parse(message.value.toString());
        o.write(
          new Date(parseInt(message.timestamp)).toISOString(),
          irc.raw.trim()
        );
      }
    },
  });
}
