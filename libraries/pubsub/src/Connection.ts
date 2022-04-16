import type WebSocket from 'ws';
import pino, { Logger } from 'pino';
import { WebSocketConnection } from '@twitch-archiving/websocket';

const logger: Logger = pino({ level: 'debug' }).child({
  module: 'events-connection',
});

export class Connection extends WebSocketConnection {
  protected topics: string[] = [];
  protected token: string;

  public constructor(token: string, topics: string[]) {
    super('wss://pubsub-edge.twitch.tv/v1');
    this.token = token;
    this.topics = topics;
  }

  protected override onOpen(): void {
    this.listen();
  }

  protected override onMessage(data: WebSocket.Data): void {
    console.log(data);
  }

  protected listen(): void {
    if (!this.ws) return;
    if (!this.token) return;
    for (let i = 0; i < this.topics.length; ++i) {
      this.ws.send(
        JSON.stringify({
          type: 'LISTEN',
          nonce: `NONCE${Math.round(Math.random() * 1312323)}`,
          data: {
            auth_token: this.token,
            topics: [this.topics],
          },
        })
      );
    }
  }

  protected override ping(): void {
    if (!this.ws) return;
    logger.debug('ping');
    this.ws.send('{"type":"PING"}');
  }

  protected override isPong(data: WebSocket.Data): boolean {
    if (data.toString().trim() === '{ "type": "PONG" }') {
      logger.debug('pong');
      return true;
    }
    return false;
  }
}
