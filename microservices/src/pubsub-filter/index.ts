import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, Consumer, TopicMessages, Message } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import fs from 'fs';
import { env2arg, initLogger } from '@twitch-archiving/utils';

interface PubsubFilterFile {
  [key: string]: string[];
}

interface PubsubFilterConfig {
  inputTopic: string;
  filterFile: string;
}

const PubsubFilterConfigOpt: ArgumentConfig<PubsubFilterConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-pubsub-events' },
  filterFile: { type: String },
};

interface Config extends PubsubFilterConfig, KafkaConfig, FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...KafkaConfigOpt,
  ...PubsubFilterConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });
  const logger: Logger = initLogger('pubsub-filter');

  const kafka: Kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
    retry: {
      retries: 100,
    },
  });
  logger.info({ topic: config.inputTopic }, 'subscribe');
  const consumer: Consumer = kafka.consumer({ groupId: 'pubsub-filter' });
  await consumer.connect();
  await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

  const producer: Producer = kafka.producer();
  await producer.connect();

  const filter: PubsubFilterFile = JSON.parse(
    await fs.promises.readFile(config.filterFile, { encoding: 'utf8' })
  );

  logger.debug({ filter }, 'filter');

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const event: { data: { topic: string } } = JSON.parse(
          message.value.toString()
        );
        logger.trace({ event }, 'event received');
        for (const key in filter) {
          if (
            event.data &&
            event.data.topic &&
            event.data.topic.startsWith(key)
          ) {
            logger.trace({ key, target: filter[key] }, 'sending event');
            await sendData(filter[key], message);
          }
        }
      }
    },
  });

  async function sendData(topic: string[], msg: Message): Promise<void> {
    const messages: TopicMessages[] = [];
    for (let i: number = 0; i < topic.length; ++i) {
      const topicMessage: TopicMessages = {
        topic: topic[i],
        messages: [msg],
      };
      messages.push(topicMessage);
    }
    logger.debug({ topic: topic, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
  }
}
