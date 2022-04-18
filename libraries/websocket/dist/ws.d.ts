import WebSocket from 'ws';
export interface MessageListener {
    message: (data: string) => void;
}
export declare abstract class WebSocketConnection {
    private status;
    protected id: string;
    protected url: string;
    protected ws: WebSocket | null;
    private pingInt;
    private pingTimeout;
    private listeners;
    constructor(url: string);
    protected send(data: string): Promise<void>;
    addListener(listener: MessageListener): void;
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
