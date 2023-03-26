import type { Emote, ChatMessage } from '@twitch-archiving/model';
export declare function insertMessage(msg: ChatMessage): Promise<void>;
export declare function setChannelEmotes(channel: string, emotes: Emote[]): Promise<void>;
export declare function getChannelEmotes(channel: string): Promise<Emote[]>;
export declare function setGlobalEmotes(emotes: Emote[]): Promise<void>;
export declare function getGlobalEmotes(): Promise<Emote[]>;
//# sourceMappingURL=chat.d.ts.map