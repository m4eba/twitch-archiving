export interface Emote {
    id: string;
    source: string;
    name: string;
    ext: string;
}
export interface EmoteData extends Emote {
    start_idx: number;
    end_idx: number;
}
export * from './Connection.js';
export * from './utils.js';
export * from './Resolver.js';
export * as seventv from './7tv.js';
export * as bettertv from './bettertv.js';
export * as ffz from './ffz.js';
//# sourceMappingURL=index.d.ts.map