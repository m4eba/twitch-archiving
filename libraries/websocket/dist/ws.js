import WebSocket from 'ws';
import pino from 'pino';
const logger = pino({ level: 'debug' }).child({ module: 'websocket' });
var Status;
(function (Status) {
    Status[Status["CLOSE"] = 0] = "CLOSE";
    Status[Status["OPEN"] = 1] = "OPEN";
})(Status || (Status = {}));
export class WebSocketConnection {
    constructor(url) {
        this.status = Status.CLOSE;
        this.id = 'ws';
        this.url = '';
        this.ws = null;
        this.pingInt = null;
        this.pingTimeout = null;
        this.listeners = [];
        this.url = url;
    }
    addListener(listener) {
        this.listeners.push(listener);
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
        this.listeners.forEach((l) => l.message(data.toString().trim()));
        this.onMessage(data);
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
