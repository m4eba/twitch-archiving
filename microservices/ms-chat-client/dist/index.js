import { KafkaConfigOpt, TwitchConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { Connection } from '@twitch-archiving/chat';
import { initLogger } from '@twitch-archiving/utils';
import fs from 'fs';
const ChatConfigOpt = {
    username: { type: String },
    oauth: { type: String },
    channelFile: { type: String },
    topic: { type: String, defaultValue: 'tw-chat' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...ChatConfigOpt,
    ...TwitchConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('chat-client');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
const producer = kafka.producer();
await producer.connect();
const connection = new Connection(config.username, config.oauth);
const channelSet = new Set();
connection.addListener({
    message: (data) => {
        if (data.params.length === 0)
            return;
        const channel = data.params[0];
        if (channel.length === 0)
            return;
        const name = channel.substring(1);
        if (!channelSet.has(name))
            return;
        sendData(name, JSON.stringify(data)).catch((e) => {
            logger.debug({ error: e }, 'error while sending');
        });
    },
});
await connection.open();
await readChannels();
fs.watch(config.channelFile, readChannels);
async function sendData(user, data) {
    const time = new Date();
    const messages = [];
    const topicMessage = {
        topic: config.topic,
        messages: [
            {
                key: user,
                value: data,
                timestamp: time.getTime().toString(),
            },
        ],
    };
    messages.push(topicMessage);
    logger.debug({ id: user, size: messages.length }, 'sending batch');
    await producer.sendBatch({ topicMessages: messages });
}
async function readChannels() {
    const content = await fs.promises.readFile(config.channelFile, {
        encoding: 'utf8',
    });
    const channels = content.split('\n');
    const newc = [];
    const partSet = new Set(channelSet);
    channels.forEach((v) => {
        partSet.delete(v);
        if (channelSet.has(v))
            return;
        newc.push(v);
        channelSet.add(v);
    });
    await connection.part(Array.from(partSet));
    await connection.join(newc);
}
