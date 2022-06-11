import type { Logger } from 'pino';
import type { FfmpegCommand } from 'fluent-ffmpeg';
import { initLogger } from './logger.js';

const logger: Logger = initLogger('ffmpeg-utils');

export async function execFfmpeg(command: FfmpegCommand): Promise<void> {
  const p = new Promise<void>((resolve, reject) => {
    command.on('start', (c) => {
      logger.trace({ command: c }, 'ffmpeg command');
    });
    command.on('error', (err: Error) => {
      reject(err);
    });
    command.on('end', () => {
      resolve();
    });
    command.run();
  });
  return p;
}
