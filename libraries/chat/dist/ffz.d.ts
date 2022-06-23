import type { Emote } from './';
export declare function channelEmotes(channel: string): Promise<{
    data: any;
    emotes: Emote[];
}>;
