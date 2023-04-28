import fs from 'fs';
import * as crypto from 'crypto';
export * from './FileWriter.js';
export * from './logger.js';
export * from './download.js';
export * from './ffmpeg.js';
export * from './fetch.js';
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function fileExists(name) {
    return fs.promises
        .access(name, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}
export function randomStr() {
    return crypto.randomBytes(20).toString('hex');
}
