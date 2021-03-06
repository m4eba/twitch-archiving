import type WebSocket from 'ws';
import { WebSocketConnection } from '@twitch-archiving/websocket';
export declare class Connection extends WebSocketConnection {
    protected topics: string[];
    protected token: string;
    constructor(token: string, topics: string[]);
    protected onOpen(): void;
    protected onMessage(data: WebSocket.Data): void;
    protected listen(): void;
    protected ping(): void;
    protected isPong(data: WebSocket.Data): boolean;
}
