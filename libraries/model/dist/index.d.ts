export interface AccessToken {
    token: string;
    sig: string;
    expires_at: string;
}
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
export interface TwitchClip {
    id: string;
    url: string;
    embed_url: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    video_id: string;
    game_id: string;
    language: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
    duration: number;
    vod_offset: number;
}
export interface TwitchClipResponse {
    data: TwitchClip[];
    pagination: {
        cursor: string;
    };
}
export interface TwitchClipAccessToken {
    clip: {
        videoQualities: {
            sourceURL: string;
        }[];
        playbackAccessToken: {
            signature: string;
            value: string;
        };
    };
}
//# sourceMappingURL=index.d.ts.map