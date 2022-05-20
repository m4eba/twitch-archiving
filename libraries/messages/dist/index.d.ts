import type { AccessToken } from '@twitch-archiving/twitch';
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
export interface PlaylistMessage {
    user: string;
    id: string;
    type: PlaylistType;
    playlist: string;
    token: AccessToken;
    url: string;
}
export interface PlaylistSegmentMessage {
    user: string;
    id: string;
    type: PlaylistType;
    sequenceNumber: number;
    duration: number;
    time: string;
    url: string;
}
export interface SegmentDownloadedMessage {
    user: string;
    id: string;
    sequenceNumber: number;
    filename: string;
    path: string;
}
