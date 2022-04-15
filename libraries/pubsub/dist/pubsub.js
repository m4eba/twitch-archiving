import pino from 'pino';
import { Connection } from "./connection";
const logger = pino({ level: 'debug' }).child({ module: 'pubsub' });
export class PubSub {
    constructor(id, token, topics) {
        this.connection = undefined;
        this.id = id;
        this.topics = topics;
        this.token = token;
        this.connection = new Connection(token, topics);
    }
}
