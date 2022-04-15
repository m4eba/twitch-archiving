import pino from 'pino';
import { WebSocketConnection } from '@twitch-archiving/websocket';
const logger = pino({ level: 'debug' }).child({ module: 'events-connection' });
export class Connection extends WebSocketConnection {
    constructor(token, topics) {
        super('wss://pubsub-edge.twitch.tv/v1');
        this.topics = [];
        this.token = token;
        this.topics = topics;
    }
    onOpen() {
        this.listen();
    }
    onMessage(data) {
        console.log(data);
    }
    listen() {
        if (!this.ws)
            return;
        if (!this.token)
            return;
        for (let i = 0; i < this.topics.length; ++i) {
            this.ws.send(JSON.stringify({
                type: 'LISTEN',
                nonce: `NONCE${Math.round(Math.random() * 1312323)}`,
                data: {
                    auth_token: this.token,
                    topics: [this.topics],
                },
            }));
        }
    }
    ping() {
        if (!this.ws)
            return;
        logger.debug('ping');
        this.ws.send('{"type":"PING"}');
    }
    isPong(data) {
        if (data.toString().trim() === '{ "type": "PONG" }') {
            logger.debug('pong');
            return true;
        }
        return false;
    }
}
