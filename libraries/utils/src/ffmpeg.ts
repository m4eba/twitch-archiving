import type { Logger } from 'pino';
import type { FfmpegCommand } from 'fluent-ffmpeg';
import { initLogger } from './logger.js';

const logger: Logger = initLogger('ffmpeg-utils');

export async function execFfmpeg(command: FfmpegCommand): Promise<string> {
  const p = new Promise<string>((resolve, reject) => {
    command.on('start', (c) => {
      console.log('ffmpeg command', c);
    });
    command.on('error', (err: Error) => {
      reject(err);
    });
    command.on('end', (out, err) => {
      resolve(err);
    });
    command.run();
  });
  return p;
}
