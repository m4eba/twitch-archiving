/// <reference types="node" />
import type { RecordingSegmentMessage } from '@twitch-archiving/messages';
export declare function timeoutPipe(ins: NodeJS.ReadableStream, outs: NodeJS.WritableStream, timeout: number, progress: (size: number) => void | undefined): Promise<number>;
export interface DownloadListener {
    updateProgress: undefined | ((seg: RecordingSegmentMessage, filename: string, size: number) => Promise<void>);
    updateFilesize: undefined | ((seg: RecordingSegmentMessage, filename: string, startSize: number, totalSize: number) => Promise<void>);
}
export declare function downloadSegment(seg: RecordingSegmentMessage, filename: string, listener: DownloadListener): Promise<void>;
//# sourceMappingURL=download.d.ts.map