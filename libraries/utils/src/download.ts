import fs from 'fs';
import fetch from 'node-fetch';
import type { Logger } from 'pino';
import { initLogger } from './logger.js';
import type { PlaylistSegmentMessage } from '@twitch-archiving/messages';

const logger: Logger = initLogger('download');

export function timeoutPipe(
  ins: NodeJS.ReadableStream,
  outs: NodeJS.WritableStream,
  timeout: number,
  progress: (size: number) => void | undefined
): Promise<number> {
  return new Promise((resolve, reject) => {
    let size = 0;
    function timeoutFailed(): void {
      reject('read timeout');
    }
    let timer = setTimeout(timeoutFailed, timeout);
    ins.on('close', () => {
      clearTimeout(timer);
      outs.end();
      resolve(size);
    });
    ins.on('end', () => {
      clearTimeout(timer);
      outs.end();
      resolve(size);
    });

    ins.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (progress !== undefined) {
        progress(size);
      }
      outs.write(chunk);
      clearTimeout(timer);
      timer = setTimeout(timeoutFailed, timeout);
    });
  });
}

export interface DownloadListener {
  updateProgress:
    | undefined
    | ((
        seg: PlaylistSegmentMessage,
        filename: string,
        size: number
      ) => Promise<void>);
  updateFilesize:
    | undefined
    | ((
        seg: PlaylistSegmentMessage,
        filename: string,
        startSize: number,
        totalSize: number
      ) => Promise<void>);
}

export async function downloadSegment(
  seg: PlaylistSegmentMessage,
  filename: string,
  listener: DownloadListener
): Promise<void> {
  logger.debug('start download', { seg, filename });
  const tmpName = filename + '.tmp';

  let retries = 0;
  let controller: AbortController | null = null;
  try {
    // these retries only handle a timeout - not an error
    while (retries < 5) {
      retries++;
      let stat = null;
      try {
        // test if file already exists
        stat = await fs.promises.stat(tmpName);
      } catch (e) {
        // do nothing
      }

      let headers = {};
      let flags = 'w';

      if (stat !== null) {
        logger.debug('resume', { seg, sise: stat.size });
        headers = {
          Range: `bytes=${stat.size}-`,
        };
      }
      controller = new AbortController();
      const resp = await fetch(seg.url, {
        headers,
        signal: controller.signal,
      });
      if (!resp.ok) throw new Error(`unexpected response ${resp.statusText}`);
      if (resp.body === null) throw new Error('body not defined');
      const clength = resp.headers.get('content-length');
      let length = 0;
      let totalLength = 0;
      let startSize = 0;
      const range = resp.headers.get('content-range');
      if (range !== null) {
        flags = 'a';
        logger.trace('range header', { seg, range });
      }
      if (clength !== null) {
        try {
          length = parseInt(clength);
          totalLength = length;
          if (stat !== null && range !== null) {
            // TODO rad range response header
            startSize = stat.size;
            totalLength = length + stat.size;
          }
        } catch (e) {
          throw new Error('unable to parse content-length ' + clength);
        }
      }
      if (listener.updateFilesize !== undefined) {
        await listener.updateFilesize(seg, filename, startSize, totalLength);
      }
      const out = fs.createWriteStream(tmpName, {
        flags,
      });

      const size = await timeoutPipe(
        resp.body,
        out,
        30 * 1000,
        (size: number) => {
          if (listener.updateProgress !== undefined) {
            listener.updateProgress(seg, filename, size).catch(() => {});
          }
        }
      );

      logger.trace('download size', { seg, length: totalLength });
      if (length > 0 && length !== size) {
        throw new Error(`file size does not match ${size}/${length}`);
      }
      await fs.promises.rename(tmpName, filename);
      let totalSize = size;
      if (stat !== null) {
        totalSize += stat.size;
      }
      if (listener.updateProgress !== undefined) {
        await listener.updateProgress(seg, filename, totalSize);
      }

      logger.debug('download done', { seg, filename });
      return;
    }
  } catch (e) {
    if (controller !== null) controller.abort();
    logger.debug('unable to download segment', { seg, filename, error: e });
  }
}
