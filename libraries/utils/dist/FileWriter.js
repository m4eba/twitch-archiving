import path from 'path';
import fs from 'fs';
export class FileWriter {
    constructor(folder) {
        this.folder = '';
        this.out = undefined;
        this.fileIsOpening = false;
        this.currentDay = 0;
        this.buffer = [];
        this.folder = folder;
    }
    write(timestamp, data) {
        if (this.out === undefined) {
            this.buffer.push({ timestamp, data });
            if (!this.fileIsOpening)
                this.openStream();
            return;
        }
        const tsDay = parseInt(timestamp.substring(8, 10));
        if (tsDay !== this.currentDay) {
            this.buffer.push({ timestamp, data });
            if (!this.fileIsOpening) {
                this.out.close();
                this.out = undefined;
                this.openStream();
            }
            return;
        }
        if (this.buffer.length > 0) {
            for (let i = 0; i < this.buffer.length; ++i) {
                this.out.write(this.buffer[i].timestamp);
                this.out.write(' ');
                this.out.write(this.buffer[i].data);
                this.out.write('\n');
            }
            this.buffer = [];
        }
        this.out.write(timestamp);
        this.out.write(' ');
        this.out.write(data);
        this.out.write('\n');
    }
    openStream() {
        this.fileIsOpening = true;
        const time = new Date();
        const year = time.getFullYear().toString();
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const day = time.getDate().toString().padStart(2, '0');
        this.currentDay = time.getDate();
        const outd = path.join(this.folder, time.getFullYear().toString(), month);
        fs.promises.mkdir(outd, { recursive: true }).then((() => {
            const filename = `${year}${month}${day}.txt`;
            this.out = fs.createWriteStream(path.join(outd, filename), { flags: 'a' });
            this.fileIsOpening = false;
        }).bind(this)).catch(() => {
            this.fileIsOpening = false;
            throw new Error('unable to create output folder');
        });
    }
}
