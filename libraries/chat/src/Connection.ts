import type WebSocket from 'ws';
import pino, { Logger } from 'pino';
import { parse, IRCMessage as ParsedMessage } from 'irc-message-ts';
import type { IRCMessage } from '@twitch-archiving/messages';
import { WebSocketConnection } from '@twitch-archiving/websocket';

const logger: Logger = pino({ level: 'debug' }).child({
  module: 'chat-connection',
});

export class Connection extends WebSocketConnection<IRCMessage> {
  private username: string;
  private oauth: string;
  private joinTimer: NodeJS.Timer | undefined = undefined;

  public constructor(username: string, oauth: string) {
    super('ws://irc-ws.chat.twitch.tv:80');
    this.username = username;
    this.oauth = oauth;
  }

  protected ping(): void {
    if (!this.ws) return;
    logger.debug('ping');
    this.ws.send('PING');
  }

  protected isPong(data: WebSocket.Data): boolean {
    if (data.toString().trim().substring(0, 4) === 'PONG') {
      logger.debug('pong');
      return true;
    }
    return false;
  }

  protected override onOpen(): void {
    if (!this.ws) return;
    this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
    this.ws.send(`PASS ${this.oauth}`);
    this.ws.send(`NICK ${this.username}`);
  }

  protected override onMessage(data: WebSocket.Data): IRCMessage {
    const result: ParsedMessage | null = parse(data.toString());
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

  public join(channels: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.joinTimer !== undefined) {
        reject('already adding channels');
        return;
      }
      const ch: string[] = [...channels];

      const join = async (): Promise<void> => {
        this.joinTimer = undefined;
        if (!this.ws) return;
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

      join().catch((e: Error) => {
        reject(e);
      });
    });
  }

  public async part(channels: string[]): Promise<void> {
    for (let i = 0; i < channels.length; ++i) {
      await this.send(`PART #${channels[i]}`);
    }
  }

  protected override onClose(): void {
    if (this.joinTimer !== undefined) {
      clearInterval(this.joinTimer);
      this.joinTimer = undefined;
    }
  }
}
