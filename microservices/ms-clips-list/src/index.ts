import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
  TwitchConfigOpt,
  TwitchConfig,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';
import { Kafka, Producer, TopicMessages, Message, Consumer } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { DateTime } from 'luxon';
import type {
  TwitchClip,
  TwitchClipResponse,
  ClipsList,
  ClipDownload,
} from '@twitch-archiving/messages';
import { initLogger, fetchWithTimeoutText } from '@twitch-archiving/utils';
import { initPostgres } from '@twitch-archiving/database';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient, HelixStream } from '@twurple/api';

interface SchedulerConfig {
  inputTopic: string;
  outputTopic: string;
}

const SchedulerConfigOpt: ArgumentConfig<SchedulerConfig> = {
  inputTopic: { type: String, defaultValue: 'tw-clips-list' },
  outputTopic: { type: String, defaultValue: 'tw-clips' },
};

interface Config
  extends SchedulerConfig,
    KafkaConfig,
    PostgresConfig,
    TwitchConfig,
    FileConfig {}

const config: Config = parse<Config>(
  {
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...SchedulerConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('clips-list');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initPostgres(config);

const consumer: Consumer = kafka.consumer({ groupId: 'clip-list' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });

const producer: Producer = kafka.producer();
await producer.connect();

const authProvider: ClientCredentialsAuthProvider =
  new ClientCredentialsAuthProvider(
    config.twitchClientId,
    config.twitchClientSecret
  );
const apiClient: ApiClient = new ApiClient({ authProvider });

async function clips(
  channel_id: string,
  access_token: string,
  token: string,
  start: string,
  end: string
): Promise<string> {
  let url = `https://api.twitch.tv/helix/clips?broadcaster_id=${channel_id}&first=100`;
  if (token.length > 0) {
    url += `&after=${token}`;
  }
  if (start) {
    url += `&started_at=${start}&ended_at=${end}`;
  }
  logger.debug({ url }, 'fetch url');
  const headers = {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-Id': config.twitchClientId,
    Authorization: 'Bearer ' + access_token,
  };

  const result = await fetchWithTimeoutText(url, 3, 3000, headers);
  return result.data;
}

await consumer.run({
  eachMessage: async ({ message }) => {
    if (!message.key) return;
    const user = message.key.toString();
    if (!message.value) return;
    const msg = JSON.parse(message.value.toString()) as ClipsList;

    if (msg.accessToken.length === 0) {
      const token = await authProvider.getAccessToken();
      if (token === null) {
        throw new Error('unable to get token');
      }
      // eslint-disable-next-line require-atomic-updates
      msg.accessToken = token.accessToken;
    }

    const result = JSON.parse(
      await clips(
        msg.channel_id,
        msg.accessToken,
        msg.pagination,
        msg.start,
        msg.end
      )
    ) as TwitchClipResponse;
    msg.count += result.data.length;

    result.data.forEach(async (c: TwitchClip) => {
      const cd: ClipDownload = {
        channel: msg.channel,
        clip: c,
      };
      await sendData(config.outputTopic, {
        key: user,
        value: JSON.stringify(cd),
        timestamp: new Date().getTime().toString(),
      });
    });

    if (msg.count > 1900) {
      const s = DateTime.fromISO(msg.start);
      const e = DateTime.fromISO(msg.end);

      const sn = parseInt(s.toFormat('X'));
      const en = parseInt(e.toFormat('X'));
      const diff = en - sn;
      if (diff > 1) {
        // split time and redo
        const middle = DateTime.fromSeconds(sn + Math.ceil(diff / 2))
          .toUTC()
          .toISO();

        const msg_first: ClipsList = {
          ...msg,
          start: msg.start,
          end: middle,
        };
        await sendData(config.inputTopic, {
          key: user,
          value: JSON.stringify(msg_first),
          timestamp: new Date().getTime().toString(),
        });
        const msg_second: ClipsList = {
          ...msg,
          start: middle,
          end: msg.end,
        };
        await sendData(config.inputTopic, {
          key: user,
          value: JSON.stringify(msg_second),
          timestamp: new Date().getTime().toString(),
        });
        return;
      }
    }
    if (result.pagination && result.pagination.cursor) {
      const msg_second: ClipsList = {
        ...msg,
        pagination: result.pagination.cursor,
      };
      await sendData(config.inputTopic, {
        key: user,
        value: JSON.stringify(msg_second),
        timestamp: new Date().getTime().toString(),
      });
    }
  },
});

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
