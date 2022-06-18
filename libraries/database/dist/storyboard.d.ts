import type { ScreenshotDoneMessage } from '@twitch-archiving/messages';
export declare function createTable(): Promise<void>;
export declare function screenshotReady(recordingId: string, sbIndex: number, data: ScreenshotDoneMessage): Promise<ScreenshotDoneMessage[]>;
export declare function getAllScreenshots(recordingId: string, sbIndex: number): Promise<ScreenshotDoneMessage[]>;
export declare function clearScreenshots(recordingId: string, sbIndex: number): Promise<void>;
export declare function incBoardCount(recordingId: string): Promise<number>;
export declare function getBoardCount(recordingId: string): Promise<number>;
export declare function clearAll(recordingId: string): Promise<void>;
