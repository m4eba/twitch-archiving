import path from 'path';
import fs from 'fs';
export class FileWriter {
    constructor(folder) {
        this.folder = '';
        this.out = undefined;
        this.fileIsOpening = false;
        this.lastDay = '';
        this.buffer = [];
        this.folder = folder;
    }
    write(timestamp, data) {
        if (this.out === undefined) {
            this.buffer.push({ timestamp, data });
            if (!this.fileIsOpening)
                this.openStream(timestamp);
            return;
        }
        const tsDay = timestamp.substring(8, 10);
        if (tsDay !== this.lastDay) {
            this.buffer.push({ timestamp, data });
            if (!this.fileIsOpening) {
                this.out.close();
                this.out = undefined;
                this.openStream(timestamp);
            }
            return;
        }
        if (this.buffer.length > 0) {
            const buf2 = [...this.buffer];
            this.buffer = [];
            for (let i = 0; i < buf2.length; ++i) {
                this.write(buf2[i].timestamp, buf2[i].data);
            }
        }
        this.out.write(timestamp);
        this.out.write(' ');
        this.out.write(data);
        this.out.write('\n');
    }
    openStream(timestamp) {
        this.fileIsOpening = true;
        const year = timestamp.substring(0, 4);
        const month = timestamp.substring(5, 7);
        const day = timestamp.substring(8, 10);
        this.lastDay = day;
        const outd = path.join(this.folder, year, month);
        fs.promises
            .mkdir(outd, { recursive: true })
            .then((() => {
            const filename = `${year}${month}${day}.txt`;
            this.out = fs.createWriteStream(path.join(outd, filename), {
                flags: 'a',
            });
            this.fileIsOpening = false;
        }).bind(this))
            .catch(() => {
            this.fileIsOpening = false;
            throw new Error('unable to create output folder');
        });
    }
}
