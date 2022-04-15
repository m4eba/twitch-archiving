/// <reference types="node" />
import WebSocket from 'ws';
import { EventEmitter } from 'events';
import type { Producer } from 'kafkajs';
export declare abstract class WebSocketConnection extends EventEmitter {
    private status;
    protected id: string;
    protected url: string;
    protected topics: string[];
    protected producer: Producer;
    protected ws: WebSocket | null;
    private pingInt;
    private pingTimeout;
    constructor(url: string, producer: Producer, topics: string[]);
    open(): void;
    close(): void;
    private wsOpen;
    private wsError;
    private wsMessage;
    private wsClose;
    private writeData;
    protected abstract ping(): void;
    protected abstract isPong(data: WebSocket.Data): boolean;
    protected onOpen(): void;
    protected onClose(): void;
    protected onMessage(data: WebSocket.Data): void;
    private timeout;
}
