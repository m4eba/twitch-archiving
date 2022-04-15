import WebSocket from 'ws';
import pino from 'pino';
import { EventEmitter } from 'events';
const logger = pino({ level: 'debug' }).child({ module: 'websocket' });
var Status;
(function (Status) {
    Status[Status["CLOSE"] = 0] = "CLOSE";
    Status[Status["OPEN"] = 1] = "OPEN";
})(Status || (Status = {}));
export class WebSocketConnection extends EventEmitter {
    constructor(url, producer, topics) {
        super();
        this.status = Status.CLOSE;
        this.id = 'ws';
        this.url = '';
        this.topics = [];
        this.ws = null;
        this.pingInt = null;
        this.pingTimeout = null;
        this.url = url;
        this.topics = topics;
        this.producer = producer;
    }
    open() {
        logger.debug({ id: this.id, url: this.url, status: this.status }, 'open');
        this.ws = new WebSocket(this.url);
        this.status = Status.OPEN;
        this.ws.on('open', () => this.wsOpen());
        this.ws.on('message', (data) => this.wsMessage(data));
        this.ws.on('close', () => this.wsClose());
        this.ws.on('error', () => this.wsError());
    }
    close() {
        if (this.ws === null)
            return;
        this.status = Status.CLOSE;
        this.ws.close();
    }
    wsOpen() {
        if (this.ws === null)
            throw new Error('websocket not defined');
        if (this.pingInt !== null) {
            clearInterval(this.pingInt);
            this.pingInt = null;
        }
        this.pingInt = setInterval(() => {
            if (this.ws === null) {
                clearInterval(this.pingInt);
                this.pingInt = null;
                return;
            }
            if (this.ws.readyState !== WebSocket.OPEN)
                return;
            this.ping();
            if (this.pingTimeout !== null) {
                clearInterval(this.pingTimeout);
            }
            this.pingTimeout = setTimeout(() => this.timeout(), 15 * 1000);
        }, 1000 * 60 * 3);
        this.onOpen();
    }
    wsError() { }
    wsMessage(data) {
        if (this.isPong(data) && this.pingTimeout) {
            clearInterval(this.pingTimeout);
            this.pingTimeout = null;
        }
        this.writeData(data)
            .catch(((e) => {
            logger.debug({ id: this.id, status: this.status, error: e }, 'unable to writeDate');
        }).bind(this))
            .finally((() => {
            this.onMessage(data);
        }).bind(this));
    }
    wsClose() {
        if (this.status === Status.CLOSE)
            return;
        logger.debug({ id: this.id, status: this.status }, 'ws disconnected, reconnect in 5 seconds');
        setTimeout(() => {
            this.open();
        }, 5 * 1000);
        this.onClose();
    }
    async writeData(data) {
        const time = new Date();
        const messages = [];
        for (let i = 0; i < this.topics.length; ++i) {
            const value = {
                id: this.id,
                data: data.toString().trim()
            };
            const topicMessage = {
                topic: this.topics[i],
                messages: [
                    {
                        key: this.id,
                        value: JSON.stringify(value),
                        timestamp: time.getTime().toString(),
                    },
                ],
            };
            messages.push(topicMessage);
        }
        logger.debug({ id: this.id, size: messages.length }, 'sending batch');
        await this.producer.sendBatch({ topicMessages: messages });
    }
    onOpen() { }
    onClose() { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @ts-ignore: no-unused-vars
    onMessage(data) { }
    timeout() {
        logger.debug({ id: this.id, status: this.status }, 'ping timeout');
        if (!this.ws)
            return;
        this.ws.close();
    }
}
