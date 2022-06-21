import fs from 'fs';
import { KafkaConfigOpt, RedisConfigOpt, PostgresConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import path from 'path';
import child_process from 'child_process';
import util from 'util';
import { initLogger } from '@twitch-archiving/utils';
import { initRedis, storyboard as sb, screenshot as ss, } from '@twitch-archiving/database';
const exec = util.promisify(child_process.exec);
const StoryboardConfigOpt = {
    inputTopic: { type: String, defaultValue: 'tw-screenshot-minimized' },
    outputTopic: { type: String, defaultValue: 'tw-storyboard-done' },
    folderToRemove: { type: String, multiple: true },
    storyboardFolder: { type: String },
    rows: { type: Number },
    columns: { type: Number },
    redisPrefix: { type: String, defaultValue: 'tw-screenshot-' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...StoryboardConfigOpt,
    ...RedisConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('screenshot-storyboard');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initRedis(config, config.redisPrefix);
logger.info({ topic: config.inputTopic }, 'subscribe');
const consumer = kafka.consumer({
    groupId: 'screenshot-storyboard',
});
await consumer.connect();
await consumer.subscribe({ topic: config.inputTopic, fromBeginning: true });
const producer = kafka.producer();
await producer.connect();
await consumer.run({
    eachMessage: async ({ message }) => {
        if (!message.key)
            return;
        if (!message.value)
            return;
        const msg = JSON.parse(message.value.toString());
        const output = path.join(config.storyboardFolder, msg.recordingId);
        await fs.promises.mkdir(output, { recursive: true });
        const filesPerBoard = config.rows * config.columns;
        const sbIndex = Math.floor(msg.index / filesPerBoard);
        logger.debug({ msg, filesPerBoard, sbIndex }, 'msg');
        // list with all screenshots that are ready for this montage
        const list = await sb.screenshotReady(msg.recordingId, sbIndex, msg);
        // order list by index
        const sorted = list.sort((a, b) => a.index - b.index);
        // build arument list
        const args = [];
        let idx = 0;
        logger.trace({ sorted }, 'sorted list');
        for (let i = sbIndex * filesPerBoard; i < (sbIndex + 1) * filesPerBoard; ++i) {
            logger.trace({ idx }, 'loop idx');
            if (idx == sorted.length)
                break;
            if (sorted[idx].index == i) {
                args.push('"' + path.join(sorted[idx].path, sorted[idx].filename) + '"');
                logger.trace({ item: sorted[idx] }, 'pushed item');
                ++idx;
            }
            else {
                args.push('null:');
            }
        }
        logger.trace({ msg, args }, 'montage file args');
        const filename = sbIndex.toString().padStart(5, '0') + '.png';
        await fs.promises.mkdir(output, { recursive: true });
        let command = 'montage ' + args.join(' ');
        command += ` -tile ${config.columns}x${config.rows}`;
        command += ' -geometry +0+0';
        command += ` ${path.join(output, filename)}`;
        logger.debug({ msg, command }, 'montage command');
        await exec(command);
        const outMsg = {
            recordingId: msg.recordingId,
            index: sbIndex,
            count: args.length,
            rows: config.rows,
            columns: config.columns,
            path: output,
            filename,
        };
        await sendData(config.outputTopic, {
            key: message.key,
            value: JSON.stringify(outMsg),
            timestamp: new Date().getTime().toString(),
        });
        // clear
        // fist test if all segments are done
        const totalCount = await ss.getTotalSegmentCount(msg.recordingId);
        logger.trace({ recordingId: msg.recordingId, totalCount }, 'total segment count');
        if (totalCount !== undefined) {
            // get all boards that are done
            const boardCount = await sb.getBoardCount(msg.recordingId);
            const left = totalCount - boardCount * filesPerBoard;
            logger.trace({ recordingId: msg.recordingId, boardCount, left }, 'board count');
            if (list.length === left) {
                logger.debug({ recordingId: msg.recordingId }, 'clear all');
                await clear(msg.recordingId, sbIndex);
                await sb.clearAll(msg.recordingId);
                await ss.clearAll(msg.recordingId);
                for (let i = 0; i < config.folderToRemove.length; ++i) {
                    await fs.promises.rmdir(path.join(config.folderToRemove[i], msg.recordingId));
                }
            }
        }
        else {
            // if we used all minimized images clear them
            if (list.length === filesPerBoard) {
                await clear(msg.recordingId, sbIndex);
                await sb.incBoardCount(msg.recordingId);
            }
        }
    },
});
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
async function clear(recordingId, sbIndex) {
    logger.debug({ recordingId, sbIndex }, 'clear');
    const data = await sb.getAllScreenshots(recordingId, sbIndex);
    for (let i = 0; i < data.length; ++i) {
        await fs.promises.rm(path.join(data[i].path, data[i].filename));
    }
    await sb.clearScreenshots(recordingId, sbIndex);
}
