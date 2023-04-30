import { TaskData, TaskRequestMsg } from '@twitch-archiving/messages';
import { initLogger, randomStr } from '@twitch-archiving/utils';
import { Message, Producer, TopicMessages } from 'kafkajs';
import { Logger } from 'pino';
import { getRecPrismaClient } from './init.js';
import { start } from './task.js';

export * as download from './download.js';
export * as screenshot from './screenshot.js';
export * as storyboard from './storyboard.js';
export * as assemblyai from './assemblyai.js';
export * as transcript from './transcript.js';
export * as vosk from './vosk.js';
export * as chat from './chat.js';
export * as clips from './clips.js';
export * as task from './task.js';
export * from './init.js';

const client = getRecPrismaClient();

const logger: Logger = initLogger('database-utils');

export async function sendData(
  producer: Producer,
  topic: string,
  msg: Message
): Promise<void> {
  const messages: TopicMessages[] = [];
  const topicMessage: TopicMessages = {
    topic,
    messages: [msg],
  };
  messages.push(topicMessage);
  logger.debug({ topic: topic, size: messages.length }, 'sending batch');
  await producer.sendBatch({ topicMessages: messages });
}
