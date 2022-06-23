import type { Emote } from './';
export declare function channelEmotes(channel: string): Promise<{
    data: any;
    emotes: Emote[];
}>;
export declare function globalEmotes(): Promise<{
    data: any;
    emotes: Emote[];
}>;
