export interface Storyboard {
    id: string;
    recording_id: string;
    index: number;
    offset: number;
    interval: number;
    first_sequence: number;
    rows: number;
    columns: number;
    slug: string;
    data: StoryboardData;
}
export interface StoryboardData {
    current_offset: number;
    images: string[];
}
export declare function createTable(): Promise<void>;
export declare function insertStoryboard(sb: Storyboard): Promise<Storyboard>;
export declare function getStoryboard(recordingId: string, index: number): Promise<Storyboard | undefined>;
export declare function getLatestStoryBoard(recordingId: string): Promise<Storyboard | undefined>;
export declare function updateStoryboard(sb: Storyboard): Promise<void>;
