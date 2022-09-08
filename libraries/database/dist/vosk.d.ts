export interface Vosk {
    id: string;
    recording_id: string;
    created: Date;
}
export declare function createTable(): Promise<void>;
