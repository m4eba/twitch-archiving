import type WebSocket from 'ws';
import type { IRCMessage } from '@twitch-archiving/messages';
import { WebSocketConnection } from '@twitch-archiving/websocket';
export declare class Connection extends WebSocketConnection<IRCMessage> {
    private username;
    private channels;
    private oauth;
    private joinTimer;
    constructor(username: string, oauth: string);
    protected ping(): void;
    protected isPong(data: WebSocket.Data): boolean;
    protected onOpen(): void;
    protected onMessage(data: WebSocket.Data): IRCMessage;
    join(channels: string[]): Promise<void>;
    part(channels: string[]): Promise<void>;
    protected onClose(): void;
}
//# sourceMappingURL=Connection.d.ts.map