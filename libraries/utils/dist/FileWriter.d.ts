export declare class FileWriter {
    private folder;
    private out;
    private fileIsOpening;
    private currentDay;
    private buffer;
    constructor(folder: string);
    write(timestamp: string, data: string): void;
    private openStream;
}
