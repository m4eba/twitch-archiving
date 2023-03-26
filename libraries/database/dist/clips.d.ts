import type { TwitchClip } from '@twitch-archiving/model';
export interface Clip {
    id: string;
    created_at: string;
    last_update: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    title: string;
    video_id: string;
    video_offset: number;
    thumbnail_url: string;
    view_count: number;
    duration: number;
    online: boolean;
    data: any;
}
export declare function createTableClips(): Promise<void>;
export declare function getClip(id: string): Promise<Clip | undefined>;
export declare function insertClip(clip: TwitchClip, offset: number, data: any): Promise<void>;
export declare function updateViewCount(id: string, view_count: number): Promise<void>;
export declare function updateStatus(id: string, status: string): Promise<void>;
export declare function updateOnline(id: string, online: boolean): Promise<void>;
//# sourceMappingURL=clips.d.ts.map