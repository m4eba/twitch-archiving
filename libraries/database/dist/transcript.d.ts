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
    word: string;
    start: number;
    end: number;
    confidence: number;
}
export declare function createTable(): Promise<void>;
export declare function insertTranscript(transcript: Transcript): Promise<string>;
