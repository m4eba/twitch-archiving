import { KafkaConfigOpt, FileConfigOpt, PostgresConfigOpt, RedisConfigOpt, } from '@twitch-archiving/config';
import 'path';
import { Kafka } from 'kafkajs';
import { parse } from 'ts-command-line-args';
import '@twitch-archiving/utils';
import { initPostgres, initRedis, chat } from '@twitch-archiving/database';
import { initLogger } from '@twitch-archiving/utils';
import { parseIrcMessageEmoteTag, Resolver, } from '@twitch-archiving/chat';
const DumpConfigOpt = {
    chatTopic: { type: String, defaultValue: 'tw-chat' },
    emoteTopic: { type: String, defaultValue: 'tw-chat-emotes-updater' },
    redisPrefix: { type: String, defaultValue: 'tw-chat-emotes' },
};
const config = parse({
    ...KafkaConfigOpt,
    ...PostgresConfigOpt,
    ...RedisConfigOpt,
    ...DumpConfigOpt,
    ...FileConfigOpt,
}, {
    loadFromFileArg: 'config',
});
const logger = initLogger('chat-save');
const kafka = new Kafka({
    clientId: config.kafkaClientId,
    brokers: config.kafkaBroker,
});
await initRedis(config, config.redisPrefix);
await initPostgres(config);
await chat.createTable();
const resolver = new Resolver();
resolver.setGlobal(await chat.getGlobalEmotes());
const consumerE = kafka.consumer({
    groupId: 'chat-save-emote-updater',
});
await consumerE.connect();
await consumerE.subscribe({ topic: config.emoteTopic, fromBeginning: true });
await consumerE.run({
    eachMessage: async ({ message }) => {
        if (message.value && message.key) {
            const msg = JSON.parse(message.value.toString());
            const channel = message.key.toString();
            resolver.setEmotes(channel, msg.emotes);
            resolver.setGlobal(msg.global);
        }
    },
});
const consumer = kafka.consumer({ groupId: 'chat-save' });
await consumer.connect();
await consumer.subscribe({ topic: config.chatTopic, fromBeginning: true });
await consumer.run({
    eachMessage: async ({ message }) => {
        if (message.value && message.key) {
            logger.info({
                message: JSON.parse(message.value.toString()),
            }, 'msg received');
            const irc = JSON.parse(message.value.toString());
            if (irc.command !== 'PRIVMSG')
                return;
            const username = irc.prefix.substring(0, irc.prefix.indexOf('!'));
            if (irc.params.length < 2)
                return;
            const text = irc.params[1].trim();
            const channel = irc.params[0].substring(1);
            let emotes = parseIrcMessageEmoteTag(text, irc.tags['emotes']);
            if (!resolver.hasEmotes(channel)) {
                resolver.setEmotes(channel, await chat.getChannelEmotes(channel));
            }
            emotes = emotes.concat(resolver.resolve(channel, text));
            logger.trace({ text, emotes, channel }, 'text with emotes');
            const msg = {
                id: irc.tags['id'],
                channel,
                username,
                message: text,
                time: new Date(parseInt(irc.tags['tmi-sent-ts'])),
                data: irc.tags,
                emotes,
            };
            await chat.insertMessage(msg);
        }
    },
});
