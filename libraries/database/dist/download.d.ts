import type { AccessToken, PlaylistType } from '@twitch-archiving/messages';
export interface Recording {
    id: string;
    start: Date;
    stop: Date | null;
    channel: string;
    site_id: string;
    data: RecordingData | null;
}
export interface RecordingData {
    type: PlaylistType;
    playlist: string;
    token: AccessToken;
    bestUrl: string;
}
export interface File {
    recording_id: string;
    name: string;
    seq: number;
    time_offset: number;
    duration: number;
    retries: number;
    datetime: Date;
    size: number;
    downloaded: number;
    hash: string;
    status: string;
}
export declare function createTableDownload(): Promise<void>;
export declare function startRecording(time: Date, channel: string, site_id: string, data: RecordingData): Promise<string>;
export declare function resumeRecording(recordingId: string): Promise<void>;
export declare function stopRecording(time: Date, recordingId: string): Promise<void>;
export declare function updateRecordingData(recordingId: string, data: RecordingData): Promise<void>;
export declare function getRecordedChannels(): Promise<string[]>;
export declare function getRecording(id: string): Promise<Recording | undefined>;
export declare function getRunningRecording(channel: string): Promise<Recording | undefined>;
export declare function getRecordingBySiteId(site_id: string): Promise<Recording | undefined>;
export declare function updateSiteId(recordingId: string, siteId: string): Promise<void>;
export declare function addFile(recordingId: string, name: string, seq: number, offset: number, duration: number, time: Date): Promise<void>;
export declare function getLatestFile(recordingId: string): Promise<File | undefined>;
export declare function getFileCount(recordingId: string, status?: string): Promise<number>;
export declare function getFile(recordingId: string, name: string): Promise<File | undefined>;
export declare function getAllFiles(recordingId: string): Promise<Array<File> | undefined>;
export declare function updateFileSize(recordingId: string, name: string, size: number): Promise<void>;
export declare function updateFileDownloadSize(recordingId: string, name: string, size: number): Promise<void>;
export declare function updateFileStatus(recordingId: string, name: string, status: string): Promise<void>;
export declare function incrementFileRetries(recordingId: string, name: string): Promise<void>;
export declare function allFilesDone(recordingId: string): Promise<boolean>;
