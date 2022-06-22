import WebSocket from 'ws';
import pino, { Logger } from 'pino';

const logger: Logger = pino({ level: 'debug' }).child({ module: 'websocket' });

enum Status {
  CLOSE,
  OPEN,
}

export interface MessageListener<IMessage> {
  message: (data: IMessage) => void;
}

export abstract class WebSocketConnection<IMessage> {
  private status: Status = Status.CLOSE;
  protected id: string = 'ws';
  protected url: string = '';

  protected ws: WebSocket | null = null;
  private pingInt: NodeJS.Timeout | null = null;
  private pingTimeout: NodeJS.Timer | null = null;

  private listeners: MessageListener<IMessage>[] = [];

  private openResolve: undefined | ((value: void | PromiseLike<void>) => void) =
    undefined;
  private openReject: undefined | ((reason?: any) => void) = undefined;

  public constructor(url: string) {
    this.url = url;
  }

  protected async send(data: string): Promise<void> {
    return new Promise(
      (
        resolve: (value: void | PromiseLike<void>) => void,
        reject: (reason?: string) => void
      ) => {
        if (!this.ws) {
          reject('no websocket open');
          return;
        }
        this.ws.send(data, () => {
          resolve();
        });
      }
    );
  }

  public addListener(listener: MessageListener<IMessage>): void {
    this.listeners.push(listener);
  }

  public open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.openResolve = resolve;
      this.openReject = reject;
      logger.debug({ id: this.id, url: this.url, status: this.status }, 'open');
      this.ws = new WebSocket(this.url);
      this.status = Status.OPEN;

      this.ws.on('open', () => this.wsOpen());
      this.ws.on('message', (data: WebSocket.Data) => this.wsMessage(data));
      this.ws.on('close', () => this.wsClose());
      this.ws.on('error', () => this.wsError());
    });
  }

  public close(): void {
    if (this.ws === null) return;
    if (this.openReject) {
      this.openReject();
      this.openReject = undefined;
    }
    this.status = Status.CLOSE;
    this.ws.close();
  }

  private wsOpen(): void {
    if (this.ws === null) throw new Error('websocket not defined');
    if (this.openResolve) {
      this.openResolve();
      this.openResolve = undefined;
    }

    if (this.pingInt !== null) {
      clearInterval(this.pingInt);
      this.pingInt = null;
    }
    this.pingInt = setInterval(() => {
      if (this.ws === null) {
        clearInterval(this.pingInt!);
        this.pingInt = null;
        return;
      }
      if (this.ws.readyState !== WebSocket.OPEN) return;
      this.ping();
      if (this.pingTimeout !== null) {
        clearInterval(this.pingTimeout);
      }
      this.pingTimeout = setTimeout(() => this.timeout(), 15 * 1000);
    }, 1000 * 60 * 3);

    this.onOpen();
  }

  private wsError(): void {}

  private wsMessage(data: WebSocket.Data): void {
    if (this.isPong(data) && this.pingTimeout) {
      clearInterval(this.pingTimeout);
      this.pingTimeout = null;
    }
    const msg: IMessage = this.onMessage(data);
    this.listeners.forEach((l) => l.message(msg));
  }

  private wsClose(): void {
    if (this.status === Status.CLOSE) return;
    logger.debug(
      { id: this.id, status: this.status },
      'ws disconnected, reconnect in 5 seconds'
    );
    setTimeout(() => {
      this.open().catch(() => {
        logger.error('unable to open');
      });
    }, 5 * 1000);

    this.onClose();
  }

  protected abstract ping(): void;
  protected abstract isPong(data: WebSocket.Data): boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-ignore: no-unused-vars
  protected abstract onMessage(data: WebSocket.Data): IMessage {}

  protected onOpen(): void {}
  protected onClose(): void {}

  private timeout(): void {
    logger.debug({ id: this.id, status: this.status }, 'ping timeout');
    if (!this.ws) return;
    this.ws.close();
  }
}
