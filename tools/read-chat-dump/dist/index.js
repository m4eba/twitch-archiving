import 'fs';
import { KafkaConfigOpt, FileConfigOpt, } from '@twitch-archiving/config';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import { parse as parseIRC } from 'irc-message-ts';
import { initLogger } from '@twitch-archiving/utils';
import lineReader from 'line-reader';
import 'process';
import 'console';
const PlaylistConfigOpt = {
    outputTopic: { type: String, defaultValue: 'tw-chat' },
    files: { type: String, multiple: true },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PlaylistConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('read-chat-dump');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
const producer = kafka.producer();
await producer.connect();
for (let i = 0; i < config.files.length; ++i) {
    lineReader.eachLine(config.files[i], async (line) => {
        // remove date from beginning of line
        // 2022-07-08T19:10:21.277Z
        line = line.substring(line.indexOf(' ') + 1);
        const result = parseIRC(line);
        if (result === null)
            return;
        const channel = result.params[0];
        if (channel.length === 0)
            return;
        const ircMessage = {
            raw: line,
            command: result.command !== null ? result.command : '',
            prefix: result.prefix !== null ? result.prefix : '',
            params: [...result.params],
            tags: { ...result.tags },
        };
        const time = new Date(parseInt(result.tags['tmi-sent-ts']));
        await sendData(config.outputTopic, {
            key: channel.substring(1),
            value: JSON.stringify(ircMessage),
            timestamp: time.getTime().toString(),
        });
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
