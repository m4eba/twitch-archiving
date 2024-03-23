import type { Logger } from 'pino';
import type { FfmpegCommand } from 'fluent-ffmpeg';
import { initLogger } from './logger.js';
import { promisify } from 'util';
import { exec } from 'child_process';

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

const pexec = promisify(exec);

export interface VideoProbe {
  streams: VideoProbeStream[];
  format: {
    filename: string;
    start_time: string;
    duration: string;
    format_name: string;
    size: string;
  };
}

export interface VideoProbeStream {
  index: number;
  codec_name: string;
  codec_type: string;
  codec_tag_string: string;
  codec_tag: string;
  width: number;
  height: number;
  codec_width: number;
  codec_height: number;
  time_base: string;
  duration?: string;
  duration_ts: number;
  r_frame_rate: string;
  avg_frame_rate: string;
  nb_frames?: string;
}

export async function ffprobe(filename: string): Promise<VideoProbe> {
  const probec = `ffprobe -v quiet \
    -print_format json -show_format \
    -show_streams ${filename}`;

  const { stdout } = await pexec(probec);
  const probe = JSON.parse(stdout);

  return probe;
}

export function getVideoProbeStream(
  probe: VideoProbe
): VideoProbeStream | null {
  for (let i = 0; i < probe.streams.length; ++i) {
    const s = probe.streams[i];
    if (s.codec_type === 'video') {
      return s;
    }
  }
  return null;
}
