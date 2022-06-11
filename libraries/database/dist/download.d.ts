import type { PlaylistMessage } from '@twitch-archiving/messages';
export interface Recording {
    id: string;
    start: Date;
    stop: Date | undefined;
    channel: string;
    site_id: string;
}
export interface File {
    recording_id: string;
    name: string;
    seq: number;
    retries: number;
    duration: number;
    datetime: Date;
    size: number;
    downloaded: number;
    hash: string;
    status: string;
}
export declare function createTableDownload(): Promise<void>;
export declare function setPlaylistMessage(data: PlaylistMessage): Promise<void>;
export declare function getPlaylistMessage(user: string): Promise<PlaylistMessage | undefined>;
export declare function setPlaylistEnding(recordingId: string): Promise<void>;
export declare function isPlaylistEnding(recordingId: string): Promise<boolean>;
export declare function incPlaylistError(recordingId: string): Promise<void>;
export declare function getPlaylistError(recordingId: string): Promise<number>;
export declare function startRecording(time: Date, channel: string, site_id: string): Promise<string>;
export declare function stopRecording(time: Date, recordingId: string): Promise<void>;
export declare function getRecordedChannels(): Promise<string[]>;
export declare function isRecording(channel: string): Promise<boolean>;
export declare function getRecordingId(channel: string): Promise<string>;
export declare function getRecording(id: string): Promise<Recording | undefined>;
export declare function updateSiteId(recordingId: string, siteId: string): Promise<void>;
export declare function startFile(recordingId: string, name: string, seq: number, duration: number, time: Date): Promise<void>;
export declare function addSegment(recordingId: string, sequenceNumber: number): Promise<void>;
export declare function testSegment(recordingId: string, sequenceNumber: number): Promise<boolean>;
export declare function finishedFile(recordingId: string, sequenceNumber: number): Promise<void>;
export declare function isRecordingDone(recordingId: string): Promise<boolean>;
export declare function getFile(recordingId: string, name: string): Promise<File | undefined>;
export declare function updateFileSize(recordingId: string, name: string, size: number): Promise<void>;
export declare function updateFileDownloadSize(recordingId: string, name: string, size: number): Promise<void>;
export declare function updateFileStatus(recordingId: string, name: string, status: string): Promise<void>;
export declare function incrementFileRetries(recordingId: string, name: string): Promise<void>;
