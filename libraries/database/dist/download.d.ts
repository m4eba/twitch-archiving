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
export declare function startRecording(time: Date, channel: string, site_id: string): Promise<string>;
export declare function stopRecording(time: Date, recordingId: string): Promise<void>;
export declare function getRecording(site_id: string): Promise<Recording | undefined>;
export declare function updateSiteId(recordingId: string, siteId: string): Promise<void>;
export declare function startFile(recordingId: string, name: string, seq: number, duration: number, time: Date): Promise<void>;
export declare function getFile(recordingId: string, name: string): Promise<File | undefined>;
export declare function updateFileSize(recordingId: string, name: string, size: number): Promise<void>;
export declare function updateFileDownloadSize(recordingId: string, name: string, size: number): Promise<void>;
export declare function updateFileStatus(recordingId: string, name: string, status: string): Promise<void>;
export declare function incrementFileRetries(recordingId: string, name: string): Promise<void>;
