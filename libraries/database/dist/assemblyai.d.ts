export interface Transcript {
    id: string;
    recording_id: string;
    transcript: string;
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
export declare function markStarted(recordingId: string): Promise<void>;
export declare function unmarkStarted(recordingId: string): Promise<void>;
