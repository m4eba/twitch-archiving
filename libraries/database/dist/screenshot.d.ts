import type { ScreenshotMessage } from '@twitch-archiving/messages';
export interface ScreenshotData {
    sequence: number;
    index: number;
    offset: number;
}
export interface Request {
    msg: ScreenshotMessage;
    filename: string;
}
export declare function markStarted(recordingId: string): Promise<void>;
export declare function unmarkStarted(recordingId: string): Promise<void>;
export declare function hasStarted(recordingId: string): Promise<boolean>;
export declare function setData(recordingId: string, data: ScreenshotData): Promise<void>;
export declare function getData(recordingId: string): Promise<ScreenshotData | undefined>;
export declare function endRecording(recordingId: string, segmentCount: number): Promise<void>;
export declare function getTotalSegmentCount(recordingId: string): Promise<number | undefined>;
export declare function incSegments(recordingId: string): Promise<void>;
export declare function setRequest(recordingId: string, data: ScreenshotData): Promise<void>;
export declare function getRequest(recordingId: string, sequence: number): Promise<ScreenshotData | undefined>;
export declare function rmRequest(recordingId: string, sequence: number): Promise<void>;
export declare function incRequests(recordingId: string): Promise<void>;
export declare function isRecordingInitDone(recordingId: string): Promise<boolean>;
export declare function clearInit(recordingId: string): Promise<void>;
export declare function clearAll(recordingId: string): Promise<void>;
