import type { ScreenshotDoneMessage } from '@twitch-archiving/messages';
export declare function createTable(): Promise<void>;
export declare function screenshotReady(recordingId: string, sbIndex: number, data: ScreenshotDoneMessage): Promise<ScreenshotDoneMessage[]>;
