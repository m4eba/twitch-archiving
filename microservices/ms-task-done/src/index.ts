import {
  KafkaConfig,
  KafkaConfigOpt,
  TwitchConfig,
  TwitchConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  RetryConfig,
  RetryConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import {
  TaskData,
  TaskDoneMsg,
  TaskRequestMsg,
} from '@twitch-archiving/messages';
import { Consumer, Kafka, Message, Producer, TopicMessages } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { initLogger, randomStr } from '@twitch-archiving/utils';
import fs from 'fs';
import path from 'path';
import { getRecPrismaClient } from '@twitch-archiving/database';
import { retry } from '@twitch-archiving/retry';
import { Task } from '@twitch-archiving/prisma/prisma/generated/rec-client';

interface ServiceConfig {
  inputTopic: string;
}

const ServiceConfigOpt: ArgumentConfig<ServiceConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-task-completed' },
};

interface Config
  extends ServiceConfig,
    KafkaConfig,
    FileConfig,
    RetryConfig,
    PostgresConfig {}

const config: Config = parse<Config>(
  {
    ...PostgresConfigOpt,
    ...KafkaConfigOpt,
    ...ServiceConfigOpt,
    ...RetryConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

interface Size {
  width: number;
  height: number;
}

const logger: Logger = initLogger('task-completed');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

const producer: Producer = kafka.producer();
await producer.connect();

const consumer: Consumer = kafka.consumer({
  groupId: 'task-completed',
});
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

await consumer.run({
  eachMessage: async ({ message, topic, partition, heartbeat }) => {
    await retry(
      async () => {
        if (!message.key) return;
        if (!message.value) return;

        const msg: TaskDoneMsg = JSON.parse(message.value.toString());
        logger.trace({ msg }, 'received');

        const client = getRecPrismaClient();

        const task = await client.task.findFirst({
          where: {
            id: BigInt(msg.taskId),
          },
        });

        if (!task) {
          throw new Error('task not found with id ' + msg.taskId);
        }

        const all = await client.task.findMany({
          where: {
            groupId: task.groupId,
          },
        });

        for (let i = 0; i < all.length; ++i) {
          const t = all[i];
          if (t.started) continue;
          const deps = new Set<string>();
          logger.trace(
            { name: task.task, dependencies: t.dependencies },
            'test task dependencies'
          );
          for (let ii = 0; ii < t.dependencies.length; ++ii) {
            deps.add(t.dependencies[ii]);
          }
          for (let ii = 0; ii < all.length; ++ii) {
            const dt = all[ii];
            if (dt.completed === null) continue;
            deps.delete(dt.task);
          }
          logger.trace(
            {
              name: task.task,
              dependencies: Array.from([...deps]),
            },
            'after deletion'
          );
          if (deps.size === 0) {
            logger.debug(
              { task: task.id.toString(), name: task.task },
              'start task'
            );
            await startTask(t);
          }
        }
      },
      {
        retryConfig: config,
        producer,
        topic,
        partition,
        message,
      }
    );
  },
});

async function startTask(task: Task): Promise<void> {
  if (!task.data) throw new Error('task without data ' + task.id.toString());

  const client = getRecPrismaClient();
  await client.task.update({
    data: {
      started: new Date(),
    },
    where: {
      id: task.id,
    },
  });

  const data: TaskData<TaskRequestMsg> = task.data as any;
  data.data.taskId = task.id.toString();

  logger.trace(
    { topic: data.topic, data: data, source: task.task },
    'sending task request'
  );
  await sendData(data.topic, {
    key: randomStr(),
    value: JSON.stringify(data.data),
    timestamp: new Date().getTime().toString(),
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
