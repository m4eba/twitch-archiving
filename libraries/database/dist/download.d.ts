export declare function createTableDownload(): Promise<void>;
export declare function startRecording(time: Date, channel: string, site_id: string): Promise<string>;
export declare function stopRecording(time: Date, recordingId: string): Promise<void>;
export declare function getRecordingId(site_id: string): Promise<string>;
export declare function updateSiteId(recordingId: string, siteId: string): Promise<void>;
export declare function startFile(recordingId: string, name: string, seq: number, duration: number, time: Date): Promise<number>;
export declare function updateFileSize(recordingId: string, name: string, size: number): Promise<void>;
export declare function updateFileDownloadSize(recordingId: string, name: string, size: number): Promise<void>;
export declare function updateFileStatus(recordingId: string, name: string, status: string): Promise<void>;
