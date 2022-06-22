import type { SegmentDownloadedMessage } from '@twitch-archiving/messages';
export interface Transcript {
    id: string;
    recording_id: string;
    transcript: string;
    total_start: number;
    total_end: number;
    segment_sequence: number;
    audio_start: number;
    audio_end: number;
    confidence: number;
    created: Date;
    words: Word[];
}
export interface Word {
    text: string;
    start: number;
    end: number;
    confidence: number;
}
export declare function createTable(): Promise<void>;
export declare function insertTranscript(transcript: Transcript): Promise<string>;
export declare function addSegment(msg: SegmentDownloadedMessage): Promise<void>;
export declare function getSegments(recordingId: string): Promise<SegmentDownloadedMessage[]>;
export declare function setEndTime(recordingId: string, time: number): Promise<void>;
export declare function getEndTime(recordingId: string): Promise<number>;
export declare function clear(recordingId: string): Promise<void>;
