export declare function createTableDownload(): Promise<void>;
export declare function startRecording(time: Date, channel: string, site_id: string): Promise<number>;
export declare function stopRecording(time: Date, recordingId: number): Promise<void>;
export declare function getRecordingId(site_id: string): Promise<string>;
export declare function updateSiteId(recordingId: number, siteId: string): Promise<void>;
export declare function startFile(recordingId: number, name: string, seq: number, duration: number, time: Date): Promise<number>;
export declare function updateFileSize(recordingId: number, name: string, size: number): Promise<void>;
export declare function updateFileDownloadSize(recordingId: number, name: string, size: number): Promise<void>;
export declare function updateFileStatus(recordingId: number, name: string, status: string): Promise<void>;
