import { parse } from 'irc-message-ts';
import { WebSocketConnection } from '@twitch-archiving/websocket';
import { initLogger } from '@twitch-archiving/utils';
const logger = initLogger('chat-connection');
export class Connection extends WebSocketConnection {
    constructor(username, oauth) {
        super('ws://irc-ws.chat.twitch.tv:80');
        this.joinTimer = undefined;
        this.username = username;
        this.oauth = oauth;
    }
    ping() {
        if (!this.ws)
            return;
        logger.debug('ping');
        this.ws.send('PING');
    }
    isPong(data) {
        if (data.toString().trim().substring(0, 4) === 'PONG') {
            logger.debug('pong');
            return true;
        }
        return false;
    }
    onOpen() {
        if (!this.ws)
            return;
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        this.ws.send(`PASS ${this.oauth}`);
        this.ws.send(`NICK ${this.username}`);
    }
    onMessage(data) {
        logger.trace({ data: data.toString() }, 'onMessage');
        const result = parse(data.toString());
        if (result === null) {
            return {
                raw: data.toString(),
                command: '',
                prefix: '',
                params: [],
                tags: {},
            };
        }
        return {
            raw: data.toString(),
            command: result.command !== null ? result.command : '',
            prefix: result.prefix !== null ? result.prefix : '',
            params: [...result.params],
            tags: { ...result.tags },
        };
    }
    join(channels) {
        return new Promise((resolve, reject) => {
            if (this.joinTimer !== undefined) {
                reject('already adding channels');
                return;
            }
            const ch = [...channels];
            const join = async () => {
                this.joinTimer = undefined;
                if (!this.ws)
                    return;
                const c = ch.splice(0, 20);
                for (let i = 0; i < c.length; ++i) {
                    await this.send(`JOIN #${c[i]}`);
                }
                if (ch.length === 0) {
                    resolve();
                    return;
                }
                this.joinTimer = setInterval(join, 15);
            };
            join().catch((e) => {
                reject(e);
            });
        });
    }
    async part(channels) {
        for (let i = 0; i < channels.length; ++i) {
            await this.send(`PART #${channels[i]}`);
        }
    }
    onClose() {
        if (this.joinTimer !== undefined) {
            clearInterval(this.joinTimer);
            this.joinTimer = undefined;
        }
    }
}
