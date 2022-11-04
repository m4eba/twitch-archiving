import path from 'path';
import sanitize from 'sanitize-filename';
import fs from 'fs';
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
import fetch from 'node-fetch';
import { Kafka, Producer, TopicMessages, Message, Consumer } from 'kafkajs';
import { ArgumentConfig, parse } from 'ts-command-line-args';
import { DateTime } from 'luxon';
import type {
  TwitchClip,
  TwitchClipAccessToken,
  TwitchClipResponse,
  ClipsList,
  ClipDownload,
} from '@twitch-archiving/messages';
import { initLogger, timeoutPipe } from '@twitch-archiving/utils';
import {
  ClipsChatReplay,
  ClipsFullVideoButton,
  gql,
  VideoAccessToken_Clip,
  WatchLivePrompt,
} from '@twitch-archiving/twitch';
import { initPostgres, clips } from '@twitch-archiving/database';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient, HelixStream } from '@twurple/api';

interface SchedulerConfig {
  outputPath: string;
  inputTopic: string;
  outputTopic: string;
}

const SchedulerConfigOpt: ArgumentConfig<SchedulerConfig> = {
  outputPath: { type: String },
  inputTopic: { type: String, defaultValue: 'tw-clips' },
  outputTopic: { type: String, defaultValue: 'tw-clips-downloaded' },
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

const logger: Logger = initLogger('clips-download');

const kafka: Kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBroker,
});

await initPostgres(config);
await clips.createTableClips();

const consumer: Consumer = kafka.consumer({ groupId: 'clip-download' });
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

await consumer.run({
  eachMessage: async ({ message, heartbeat }) => {
    if (!message.value) return;
    const msg = JSON.parse(message.value.toString()) as ClipDownload;

    const clip = await clips.getClip(msg.clip.id);

    if (clip !== undefined) {
      await clips.updateViewCount(msg.clip.id, msg.clip.view_count);
      return;
    }

    const result: any = await gql([
      VideoAccessToken_Clip(msg.clip.id),
      WatchLivePrompt(msg.clip.id),
      ClipsFullVideoButton(msg.clip.id),
    ]);
    let offset: number | null = null;
    console.log(result);
    try {
      if (result[2].data) {
        offset = parseInt(result[2].data.clip.videoOffsetSeconds);
      }
    } catch (e) {
      console.log({ error: e }, 'unable to read offset');
    }
    const result2: any = await gql([ClipsChatReplay(msg.clip.id, offset)]);

    const json = {
      Data: msg.clip,
      VideoAccessToken_Clip: result[0].data,
      WatchLivePrompt: result[1].data,
      ClipsFullVideoButton: result[2].data,
      ClipsChatReplay: result2[0].data,
    };

    await download(msg.clip, result[0].data, json, heartbeat);

    await clips.insertClip(msg.clip, offset !== null ? offset : -1, json);
  },
});

async function download(
  clip: TwitchClip,
  accessToken: TwitchClipAccessToken,
  json: any,
  heartbeat: () => Promise<void>
): Promise<void> {
  const date = clip.created_at.substring(0, 10);
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  const out = path.join(
    config.outputPath,
    clip.broadcaster_name,
    year,
    month,
    day
  );
  const name = sanitize(clip.title + '_' + clip.id);
  const json_out = path.join(path.join(out, name + '.json'));
  logger.trace({ out }, 'path');
  await fs.promises.mkdir(out, { recursive: true });
  await fs.promises.writeFile(json_out, JSON.stringify(json, null, ' '));
  let url = accessToken.clip.videoQualities[0].sourceURL;
  url += '?sig=' + accessToken.clip.playbackAccessToken.signature;
  url +=
    '&token=' + encodeURIComponent(accessToken.clip.playbackAccessToken.value);
  logger.trace({ url }, 'clip url');
  const clip_out = path.join(out, name + '.mp4');

  const response = await fetch(url);
  if (!response.ok || response.body === null) {
    logger.error({ response: response.statusText }, 'unexpected response');
    throw new Error(`unexpected response ${response.statusText}`);
  }

  const fsout = fs.createWriteStream(clip_out);
  await timeoutPipe(response.body, fsout, 30 * 1000, () => {
    heartbeat().catch(() => {});
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
