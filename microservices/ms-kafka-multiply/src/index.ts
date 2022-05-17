import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Consumer, Producer, TopicMessages } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { initLogger } from '@twitch-archiving/utils';

interface MultiConfig {
  inputTopic: string;
  outputTopic: string[];
}

const MultiConfigOpt: ArgumentConfig<MultiConfig> = {
  inputTopic: { type: String },
  outputTopic: { type: String, multiple: true },
};

interface Config extends MultiConfig, KafkaConfig, FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...MultiConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('kafka-multi');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer: Consumer = kafka.consumer({ groupId: 'websocket-dump' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

// TODO use eachBatch instead
await consumer.run({
  eachMessage: async ({ message }) => {
    const messages: TopicMessages[] = [];
    for (let i: number = 0; i < config.outputTopic.length; ++i) {
      const topicMessage: TopicMessages = {
        topic: config.outputTopic[i],
        messages: [message],
      };
      messages.push(topicMessage);
    }
    await producer.sendBatch({ topicMessages: messages });
  },
});
