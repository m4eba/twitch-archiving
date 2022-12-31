export declare const ITPlaylistGetLive: {
    events: string;
    request: string;
};
export declare const OTPlaylistGetLive: {
    masterPlaylistText: string;
};
export declare const ITPlaylistParseMaster: string;
export declare const OTPlaylistParseMaster: {
    playlist: string;
    recording: string;
    playlistUpdate: string;
    masterPlaylistRequest: string;
};
export declare const ITPlaylistUpdate: string;
export declare const OTPlaylistUpdate: {
    playlistText: string;
    masterPlaylistRequest: string;
};
export declare const ITPlaylistParse: string;
export declare const OTPlaylistParse: string;
export interface AccessToken {
    token: string;
    sig: string;
    expires_at: string;
}
export interface WebsocketMessage {
    data: string;
}
export interface IRCMessage {
    raw: string;
    tags: Record<string, string>;
    prefix: string;
    command: string;
    params: string[];
}
export declare enum PlaylistType {
    LIVE = 0,
    VOD = 1
}
export declare enum RecordingMessageType {
    STARTED = 0,
    ENDED = 1,
    SEGMENT = 2
}
export interface RecordingMessage {
    type: RecordingMessageType;
    user: string;
    id: string;
    recordingId: string;
    playlistType: PlaylistType;
}
export interface RecordingStartedMessage extends RecordingMessage {
}
export interface RecordingEndedMessage extends RecordingMessage {
    segmentCount: number;
}
export interface RecordingSegmentMessage extends RecordingMessage {
    sequenceNumber: number;
    offset: number;
    duration: number;
    time: string;
    url: string;
}
export interface MasterPlaylistRequestMessage {
    user: string;
}
export declare enum MasterPlaylistSourceType {
    EVENT = 0,
    STREAM_UP_EVENT = 1,
    REQUEST = 2
}
export interface MasterPlaylistTextMessage {
    user: string;
    id: string;
    text: string;
    recordingId: string;
    source: MasterPlaylistSourceType;
    token?: AccessToken;
}
export interface PlaylistTextMessage {
    user: string;
    id: string;
    text: string;
    recordingId: string;
}
export interface PlaylistRequestMessage {
    user: string;
    id: string;
    recordingId: string;
    type: PlaylistType;
    playlist: string;
    token: AccessToken;
    url: string;
}
export declare enum PlaylistMessageType {
    START = 0,
    END = 1,
    DOWNLOAD = 2
}
export interface PlaylistMessage {
    type: PlaylistMessageType;
    user: string;
    id: string;
    recordingId: string;
}
export declare enum SegmentDownloadedStatus {
    DONE = 0,
    ERROR = 1
}
export interface SegmentDownloadedMessage extends PlaylistMessage {
    sequenceNumber: number;
    offset: number;
    duration: number;
    filename: string;
    path: string;
    status: SegmentDownloadedStatus;
}
export interface ScreenshotMessage {
    segment: SegmentDownloadedMessage;
    index: number;
    offset: number;
}
export interface ScreenshotDoneMessage {
    recordingId: string;
    index: number;
    filename: string;
    path: string;
}
export interface StoryboardDoneMessage {
    recordingId: string;
    index: number;
    count: number;
    rows: number;
    columns: number;
    path: string;
    filename: string;
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
export interface ClipsList {
    channel: string;
    channel_id: string;
    start: string;
    end: string;
    pagination: string;
    count: number;
    accessToken: string;
}
export interface ClipDownload {
    channel: string;
    clip: TwitchClip;
}
