import WebSocket from 'ws';
import pino, { Logger } from 'pino';
import { EventEmitter } from 'events';

const logger: Logger = pino({level:'debug'}).child({module:'websocket'});

enum Status {
  CLOSE,
  OPEN,
}

export abstract class WebSocketConnection extends EventEmitter {
  private status: Status = Status.CLOSE;
  protected id: string = 'ws';
  protected url: string = '';
  
  protected ws: WebSocket | null = null;
  private pingInt: NodeJS.Timeout | null = null;
  private pingTimeout: NodeJS.Timer | null = null;

  public constructor(url: string) {
    super();
    this.url = url;
  }

  public open(): void {
    logger.debug({id:this.id,url:this.url,status:this.status},'open');
    this.ws = new WebSocket(this.url);
    this.status = Status.OPEN;

    this.ws.on('open', () => this.wsOpen());
    this.ws.on('message', (data: WebSocket.Data) => this.wsMessage(data));
    this.ws.on('close', () => this.wsClose());
    this.ws.on('error', () => this.wsError());
  }

  public close(): void {
    if (this.ws === null) return;
    this.status = Status.CLOSE;
    this.ws.close();
  }

  private wsOpen(): void {
    if (this.ws === null) throw new Error('websocket not defined');

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

  private wsError():void {}

  private wsMessage(data: WebSocket.Data):void {
    if (this.isPong(data) && this.pingTimeout) {
      clearInterval(this.pingTimeout);
      this.pingTimeout = null;
    }
    this.onMessage(data);
  }

  private wsClose():void {
    if (this.status === Status.CLOSE) return;
    logger.debug({id:this.id,status:this.status},'ws disconnected, reconnect in 5 seconds');
    setTimeout(() => {
      this.open();
    }, 5 * 1000);

    this.onClose();
  }

  
  
  protected abstract ping(): void;
  protected abstract isPong(data: WebSocket.Data): boolean;

  protected onOpen(): void {}
  protected onClose(): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-ignore: no-unused-vars
  protected onMessage(data: WebSocket.Data): void {}

  private timeout(): void {
    logger.debug({id:this.id,status:this.status},'ping timeout');
    if (!this.ws) return;
    this.ws.close();
  }
}
