/// <reference types="node" />
import WebSocket from 'ws';
import { EventEmitter } from 'events';
export declare abstract class WebSocketConnection extends EventEmitter {
    private status;
    protected id: string;
    protected url: string;
    protected ws: WebSocket | null;
    private pingInt;
    private pingTimeout;
    constructor(url: string);
    open(): void;
    close(): void;
    private wsOpen;
    private wsError;
    private wsMessage;
    private wsClose;
    protected abstract ping(): void;
    protected abstract isPong(data: WebSocket.Data): boolean;
    protected onOpen(): void;
    protected onClose(): void;
    protected onMessage(data: WebSocket.Data): void;
    private timeout;
}
