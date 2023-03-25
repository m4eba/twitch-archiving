import type { EmoteData, Emote } from '@twitch-archiving/chat';
export interface ChatMessage {
    id: string;
    channel: string;
    username: string;
    message: string;
    command: string;
    time: Date;
    data: any;
    emotes: EmoteData[];
}
export interface ChatEmote {
    id: string;
    source: string;
    name: string;
    data: any;
}
export declare function createTable(): Promise<void>;
export declare function insertMessage(msg: ChatMessage): Promise<void>;
export declare function setChannelEmotes(channel: string, emotes: Emote[]): Promise<void>;
export declare function getChannelEmotes(channel: string): Promise<Emote[]>;
export declare function setGlobalEmotes(emotes: Emote[]): Promise<void>;
export declare function getGlobalEmotes(): Promise<Emote[]>;
//# sourceMappingURL=chat.d.ts.map