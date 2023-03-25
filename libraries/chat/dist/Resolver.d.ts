import type { Emote, EmoteData } from '.';
export declare class Resolver {
    private global;
    private channel;
    constructor();
    setGlobal(emotes: Emote[]): void;
    setEmotes(channel: string, emotes: Emote[]): void;
    hasEmotes(channel: string): boolean;
    resolve(channel: string, text: string): EmoteData[];
}
//# sourceMappingURL=Resolver.d.ts.map