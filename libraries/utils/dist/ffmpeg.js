import { initLogger } from './logger.js';
const logger = initLogger('ffmpeg-utils');
export async function execFfmpeg(command) {
    const p = new Promise((resolve, reject) => {
        command.on('start', (c) => {
            logger.trace({ command: c }, 'ffmpeg command');
        });
        command.on('error', (err) => {
            reject(err);
        });
        command.on('end', () => {
            resolve();
        });
        command.run();
    });
    return p;
}
