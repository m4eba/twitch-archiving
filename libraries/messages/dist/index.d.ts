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
