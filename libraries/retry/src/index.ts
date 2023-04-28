import asr from 'async-retry';
import { RetryConfig } from '@twitch-archiving/config';
import { KafkaMessage, Producer } from 'kafkajs';
import { initLogger } from '@twitch-archiving/utils';
import { Logger } from 'pino';
import { serializeError } from 'serialize-error';

const logger: Logger = initLogger('retry');

export interface RetryMessage {
  topic: string;
  key: string;
  partition: number;
  offset: string;
  timestamp: string;
  error: any;
  message?: any;
}

export interface RetryOpt {
  retryConfig: RetryConfig;
  producer: Producer;
  topic: string;
  partition: number;
  message: KafkaMessage;
}

export async function retry(func: () => Promise<any>, opt: RetryOpt) {
  try {
    await asr(func, {
      retries: opt.retryConfig.retries,
      onRetry: (e: Error) => {
        logRetry(e, opt);
      },
    });
  } catch (e: any) {
    logRetry(e, opt);
  }
}

async function logRetry(error: any, opt: RetryOpt) {
  try {
    if (opt.producer) {
      const msg: RetryMessage = {
        topic: opt.topic,
        key: opt.message.key ? opt.message.key.toString() : '',
        partition: opt.partition,
        offset: opt.message.offset,
        timestamp: opt.message.timestamp,
        error: serializeError(error),
        message: opt.message.value
          ? JSON.parse(opt.message.value?.toString())
          : undefined,
      };
      opt.message.timestamp;
      await opt.producer.send({
        topic: opt.retryConfig.failedTopic,
        messages: [
          {
            key: opt.topic ? opt.topic : opt.retryConfig.failedTopic,
            value: JSON.stringify(msg),
          },
        ],
      });
    }
  } catch (e) {
    logger.error({ opt, error, logError: e }, 'unable to log retry');
  }
}
