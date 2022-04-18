import WebSocket from 'ws';
export interface MessageListener<IMessage> {
    message: (data: IMessage) => void;
}
export declare abstract class WebSocketConnection<IMessage> {
    private status;
    protected id: string;
    protected url: string;
    protected ws: WebSocket | null;
    private pingInt;
    private pingTimeout;
    private listeners;
    constructor(url: string);
    protected send(data: string): Promise<void>;
    addListener(listener: MessageListener<IMessage>): void;
    open(): void;
    close(): void;
    private wsOpen;
    private wsError;
    private wsMessage;
    private wsClose;
    protected abstract ping(): void;
    protected abstract isPong(data: WebSocket.Data): boolean;
    protected abstract onMessage(data: WebSocket.Data): IMessage;
    protected onOpen(): void;
    protected onClose(): void;
    private timeout;
}
