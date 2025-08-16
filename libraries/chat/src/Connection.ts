import type WebSocket from 'ws';
import type { Logger } from 'pino';
import { parse, IRCMessage as ParsedMessage } from 'irc-message-ts';
import type { IRCMessage } from '@twitch-archiving/messages';
import { WebSocketConnection } from '@twitch-archiving/websocket';
import { initLogger } from '@twitch-archiving/utils';

const logger: Logger = initLogger('chat-connection');

export class Connection extends WebSocketConnection<IRCMessage> {
  private username: string;
  private channels: Set<string> = new Set();
  private oauth: string;
  private joinTimer: NodeJS.Timer | undefined = undefined;

  public constructor(username: string, oauth: string) {
    super('wss://irc-ws.chat.twitch.tv:443');
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

    setTimeout(() => {
      this.join(Array.from(this.channels)).catch((e) => {
        logger.error({ error: e }, 'unable to join channels');
      });
    }, 1000);
  }

  protected override onMessage(data: WebSocket.Data): IRCMessage {
    logger.trace({ data: data.toString() }, 'onMessage');
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
    channels.forEach((c) => this.channels.add(c));

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
      this.channels.delete(channels[i]);
    }
  }

  protected override onClose(): void {
    if (this.joinTimer !== undefined) {
      clearInterval(this.joinTimer);
      this.joinTimer = undefined;
    }
  }
}
