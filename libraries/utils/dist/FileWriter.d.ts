export declare class FileWriter {
    private folder;
    private out;
    private fileIsOpening;
    private lastDay;
    private buffer;
    constructor(folder: string);
    write(timestamp: string, data: string): void;
    private openStream;
}
//# sourceMappingURL=FileWriter.d.ts.map