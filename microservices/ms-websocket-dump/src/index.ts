import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import path from 'path';
import pino, { Logger } from 'pino';
import { Kafka, Consumer } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { FileWriter } from '@twitch-archiving/utils';

interface DumpConfig {
  topic: string;
  path: string;
}

const DumpConfigOpt: ArgumentConfig<DumpConfig> = {
  topic: { type: String },
  path: { type: String },
};

interface Config extends DumpConfig, KafkaConfig, FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...DumpConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = pino({ level: 'debug' }).child({
  module: 'websocket-dump',
});

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

logger.info({ topic: config.topic }, 'subscribe');
const consumer: Consumer = kafka.consumer({ groupId: 'websocket-dump' });
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
        o = new FileWriter(path.join(config.path, key));
        out.set(key, o);
      }
      o.write(
        new Date(parseInt(message.timestamp)).toISOString(),
        message.value.toString()
      );
    }
  },
});
