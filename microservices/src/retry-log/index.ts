import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  RetryConfig,
  RetryConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Consumer, Kafka, Message, Producer, TopicMessages } from 'kafkajs';
import { ArgumentConfig, createOptionRow, parse } from 'ts-command-line-args';
import { env2arg, initLogger } from '@twitch-archiving/utils';
import { RetryMessage, retry } from '@twitch-archiving/retry';
import { initPostgres, getP } from '@twitch-archiving/database';

interface ServiceConfig {}

const ServiceConfigOpt: ArgumentConfig<ServiceConfig> = {};

interface Config
  extends ServiceConfig,
    KafkaConfig,
    RetryConfig,
    FileConfig,
    PostgresConfig {}

const argConf: ArgumentConfig<Config> = {
  ...PostgresConfigOpt,
  ...KafkaConfigOpt,
  ...RetryConfigOpt,
  ...ServiceConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });

  const logger: Logger = initLogger('retry-log');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
  });

  await initPostgres(config);

  const producer: Producer = kafka.producer();
  await producer.connect();

  const consumer: Consumer = kafka.consumer({
    groupId: 'retry-log',
    retry: {
      retries: 5,
    },
  });
  await consumer.connect();
  await consumer.subscribe({ topic: config.failedTopic, fromBeginning: true });

  const { pool } = getP();

  await consumer.run({
    eachMessage: async ({ message, topic, partition, heartbeat }) => {
      if (!message.key) return;
      if (!message.value) return;

      const msg: RetryMessage = JSON.parse(message.value.toString());
      logger.trace({ msg }, 'retry log msg received');

      try {
        await pool.query(
          'INSERT INTO retry_log (topic,time,data) VALUES ($1,$2,$3)',
          [
            msg.topic,
            new Date(parseInt(msg.timestamp)).toISOString(),
            JSON.stringify(msg),
          ]
        );
      } catch (e: any) {
        logger.error({ error: e.toString() }, 'unable to log');
        throw e;
      }
    },
  });
}
