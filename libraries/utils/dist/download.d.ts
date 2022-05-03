/// <reference types="node" />
import type { PlaylistSegmentMessage } from '@twitch-archiving/messages';
export declare function timeoutPipe(ins: NodeJS.ReadableStream, outs: NodeJS.WritableStream, timeout: number, progress: (size: number) => void | undefined): Promise<number>;
export interface DownloadListener {
    updateProgress: undefined | ((seg: PlaylistSegmentMessage, filename: string, size: number) => Promise<void>);
    updateFilesize: undefined | ((seg: PlaylistSegmentMessage, filename: string, startSize: number, totalSize: number) => Promise<void>);
}
export declare function downloadSegment(seg: PlaylistSegmentMessage, filename: string, listener: DownloadListener): Promise<void>;
