import path from 'path';
import sanitize from 'sanitize-filename';
import fs from 'fs';
import { KafkaConfigOpt, FileConfigOpt, PostgresConfigOpt, TwitchConfigOpt, } from '@twitch-archiving/config';
import fetch from 'node-fetch';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import 'luxon';
import { initLogger, timeoutPipe } from '@twitch-archiving/utils';
import { ClipsChatReplay, ClipsFullVideoButton, gql, VideoAccessToken_Clip, WatchLivePrompt, } from '@twitch-archiving/twitch';
import { initPostgres, clips } from '@twitch-archiving/database';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
const SchedulerConfigOpt = {
    outputPath: { type: String },
    inputTopic: { type: String, defaultValue: 'tw-clips' },
    outputTopic: { type: String, defaultValue: 'tw-clips-downloaded' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...SchedulerConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('clips-download');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initPostgres(config);
await clips.createTableClips();
const consumer = kafka.consumer({ groupId: 'clip-download' });
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
const authProvider = new ClientCredentialsAuthProvider(config.twitchClientId, config.twitchClientSecret);
const apiClient = new ApiClient({ authProvider });
await consumer.run({
    eachMessage: async ({ message, heartbeat }) => {
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        const clip = await clips.getClip(msg.clip.id);
        if (clip !== undefined) {
            await clips.updateViewCount(msg.clip.id, msg.clip.view_count);
            return;
        }
        const result = await gql([
            VideoAccessToken_Clip(msg.clip.id),
            WatchLivePrompt(msg.clip.id),
            ClipsFullVideoButton(msg.clip.id),
        ]);
        let offset = null;
        console.log(result);
        try {
            if (result[2].data) {
                offset = parseInt(result[2].data.clip.videoOffsetSeconds);
            }
        }
        catch (e) {
            console.log({ error: e }, 'unable to read offset');
        }
        const result2 = await gql([ClipsChatReplay(msg.clip.id, offset)]);
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
async function download(clip, accessToken, json, heartbeat) {
    const date = clip.created_at.substring(0, 10);
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const out = path.join(config.outputPath, year, month, day);
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
        heartbeat().catch(() => { });
    });
}
async function sendData(topic, msg) {
    const messages = [];
    const topicMessage = {
        topic,
        messages: [msg],
    };
    messages.push(topicMessage);
    logger.debug({ topic: topic, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
}
