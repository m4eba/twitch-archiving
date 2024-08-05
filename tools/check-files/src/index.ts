import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {
  KafkaConfig,
  KafkaConfigOpt,
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';

import { ArgumentConfig, parse } from 'ts-command-line-args';
import { RecPrisma, RecPrismaClient } from '@twitch-archiving/prisma';
import {
  initLogger,
  fileExists,
  ffprobe,
  getVideoProbeStream,
  getAudioProbeStream,
  VideoProbe,
  AudioProbeStream,
  VideoProbeStream,
} from '@twitch-archiving/utils';
import { getP, initPostgres } from '@twitch-archiving/database';
import {
  FileStatus,
  Recording,
} from '@twitch-archiving/prisma/prisma/generated/rec-client/index.js';
import { exec } from 'child_process';

interface ToolConfig {
  reportPath: string;
  filePath: string;
  channel: string;
  expectedWidth: number;
  expectedHeight: number;
  skip: string[];
}

const ToolConfigOpt: ArgumentConfig<ToolConfig> = {
  reportPath: { type: String },
  filePath: { type: String },
  channel: { type: String },
  expectedHeight: { type: Number, defaultValue: 1080 },
  expectedWidth: { type: Number, defaultValue: 1920 },
  skip: { type: String, multiple: true, defaultValue: [] },
};

interface Config extends ToolConfig, PostgresConfig, FileConfig {}

const config: Config = parse<Config>(
  {
    ...ToolConfigOpt,
    ...PostgresConfigOpt,
    ...FileConfigOpt,
  },
  {
    loadFromFileArg: 'config',
  }
);

const logger: Logger = initLogger('check-files');

const client = new RecPrismaClient();

const recordings = await client.recording.findMany({
  where: {
    channel: config.channel,
    stop: {
      not: null,
    },
  },
  orderBy: {
    start: 'desc',
  },
});

await fs.promises.mkdir(config.reportPath, { recursive: true });

const streamLogFilename = path.join(config.reportPath, 'streams-passed.json');

let streams: Array<string> = [];
if (await fileExists(streamLogFilename)) {
  streams = JSON.parse(
    await fs.promises.readFile(streamLogFilename, { encoding: 'utf-8' })
  );
}

for (let i = 0; i < recordings.length; ++i) {
  if (streams.indexOf(recordings[i].site_id) > -1) {
    console.log('skip already passed', recordings[i].site_id);
    continue;
  }
  if (config.skip.indexOf(recordings[i].site_id) > -1) {
    console.log('skip from config', recordings[i].site_id);
    continue;
  }
  if (await checkStream(recordings[i])) {
    streams.push(recordings[i].site_id);
    await fs.promises.writeFile(
      streamLogFilename,
      JSON.stringify(streams, null, ' ')
    );
  }
}

interface IntegrityResult {
  success: boolean;
  errors?: string;
}

// don't think i need that
// if the file is cut ffprobe seems to return a smaller druation
async function checkFileIntegrity(filePath: string): Promise<IntegrityResult> {
  return new Promise((resolve, reject) => {
    // Constructing the ffmpeg command
    const command = `ffmpeg -v error -i "${filePath}" -f null -`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        // Error executing command
        reject(error);
        return;
      }
      if (stderr) {
        // ffmpeg reported errors
        resolve({ success: false, errors: stderr });
      } else {
        // No errors, file is likely okay
        resolve({ success: true });
      }
    });
  });
}

function findMatchingDuration(
  video: VideoProbeStream | null,
  audio: AudioProbeStream | null,
  duration: number
): number {
  let vd = 99999;
  let vl = 0;
  if (video && video.duration) {
    vl = parseFloat(video.duration);
    vd = vl - duration;
  }
  let ad = 99999;
  let al = 0;
  if (audio && audio.duration) {
    al = parseFloat(audio.duration);
    ad = al - duration;
  }
  if (Math.abs(vd) < Math.abs(ad)) {
    return vl;
  } else {
    return al;
  }
}

async function findTimeForSeq(
  playlistPath: string,
  seq: number
): Promise<{ seq: number; time: number }> {
  const fileStream = fs.createReadStream(playlistPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentSequence: number | null = null;
  let currentElapsedTime: number | null = null;

  for await (const line of rl) {
    if (line.startsWith('#EXT-X-TWITCH-LIVE-SEQUENCE:')) {
      currentSequence = parseInt(line.split(':')[1], 10);
    } else if (line.startsWith('#EXT-X-TWITCH-ELAPSED-SECS:')) {
      currentElapsedTime = parseFloat(line.split(':')[1]);

      // Check if we have found the target sequence number
      if (currentSequence !== null && currentSequence >= seq) {
        return { seq: currentSequence, time: currentElapsedTime };
      }
    }
  }

  return { seq: -1, time: -1 };
}
async function checkPlaylist(
  recording: Recording,
  seq: number
): Promise<boolean> {
  console.log('checkplaylist recording', recording, seq);
  const outputPath = path.join(config.reportPath, recording.site_id);
  const playlistPath = path.join(outputPath, 'playlist.log');
  if (!(await fileExists(playlistPath))) return false;

  const seqtime = await findTimeForSeq(playlistPath, seq);

  const file = await client.file.findFirst({
    where: {
      recordingId: recording.id,
      seq: seqtime.seq,
    },
  });

  console.log('seqtime', seqtime);
  console.log('file', file);
  if (file && file.timeOffset.toNumber() === seqtime.time) {
    return true;
  }

  return false;
}

async function checkStream(recording: Recording): Promise<boolean> {
  console.log('check stream', recording.site_id);
  const outputPath = path.join(config.reportPath, recording.site_id);
  const errorFilename = path.join(outputPath, 'error.txt');
  if (await fileExists(errorFilename)) {
    console.log('deleting error file');
    await fs.promises.rm(errorFilename);
  }

  let retries = 0;

  while (retries < 3) {
    try {
      await fs.promises.mkdir(outputPath, { recursive: true });

      const files = await client.file.findMany({
        where: {
          recordingId: recording.id,
        },
        orderBy: {
          seq: 'asc',
        },
      });

      const obj = {
        ...recording,
        id: Number(recording.id),
        files: files.length,
        duration:
          files[files.length - 1].timeOffset.toNumber() +
          files[files.length - 1].duration.toNumber(),
      };
      // @ts-ignore
      delete obj.data;
      await fs.promises.writeFile(
        path.join(outputPath, 'info.json'),
        JSON.stringify(obj, null, ' ')
      );

      console.log('files', files.length);

      const fileLogFilename = path.join(outputPath, 'files.log');
      interface FileTestData {
        seq: number;
        ffmpegTime: number;
        m3u8Time: number;
      }
      let testData: FileTestData = {
        seq: -1,
        ffmpegTime: 0,
        m3u8Time: 0,
      };

      if (await fileExists(fileLogFilename)) {
        const fileLog = (
          await fs.promises.readFile(fileLogFilename, { encoding: 'utf-8' })
        )
          .split('\n')
          .filter((v) => v && v.length > 0);
        if (fileLog.length > 0) {
          const lastFileData = fileLog[fileLog.length - 1];
          if (lastFileData.length > 0) {
            testData = JSON.parse(lastFileData);
          }
          console.log('continue test data', testData);
        }
      }

      const fileLog = fs.createWriteStream(fileLogFilename, { flags: 'a' });
      const probeOutput = path.join(outputPath, 'probe');
      await fs.promises.mkdir(probeOutput, { recursive: true });

      const segmentPath = path.join(
        config.filePath,
        config.channel,
        'stream',
        recording.site_id
      );

      for (let i = testData.seq + 1; i < files.length; ++i) {
        const f = files[i];
        if (f.seq !== i) {
          throw new Error('sequence error ' + f.seq + ' != ' + i);
        }
        const name = path.join(segmentPath, f.name);
        if (!(await fileExists(name))) {
          throw new Error('missing file ' + f.name);
        }
        console.log('testing file', f.name);

        const integrity = await checkFileIntegrity(name);
        console.log('integrity', integrity);
        if (!integrity.success) {
          throw new Error(
            'integrity fail for ' + f.name + ' ' + integrity.errors
          );
        }

        const probe = await ffprobe(name);
        await fs.promises.writeFile(
          path.join(probeOutput, f.name + '.json'),
          JSON.stringify(probe, null, ' ')
        );
        const video = getVideoProbeStream(probe);
        const audio = getAudioProbeStream(probe);

        if (video === null && audio === null) {
          throw new Error('no stream found in ' + f.name);
        }

        if (video) {
          if (
            (video.width !== config.expectedWidth ||
              video.height !== config.expectedHeight) &&
            f.seq < files.length - 1 // pass wrong resolution on last file
          ) {
            throw new Error(
              'resolution error in ' +
                f.name +
                ' ' +
                video.width +
                'x' +
                video.height
            );
          }
        }
        const duration = findMatchingDuration(
          video,
          audio,
          f.duration.toNumber()
        );
        const diff = f.duration.toNumber() - duration;
        // don't check length for last 2 files
        //if ((diff < -0.03 || diff > 0.03) && f.seq < files.length - 2) {
        console.log('duration diff', Math.abs(diff));
        if (
          (diff < -0.03 || diff > 0.03) &&
          !(await checkPlaylist(recording, f.seq))
        ) {
          throw new Error(
            'duration diff too big in ' +
              f.name +
              ' ' +
              f.duration +
              ' ' +
              duration
          );
        }
        testData = {
          seq: f.seq,
          ffmpegTime: testData.ffmpegTime + duration,
          m3u8Time: testData.m3u8Time + f.duration.toNumber(),
        };
        console.log('data', testData);
        fileLog.write(JSON.stringify(testData) + '\n');
      }
      return true;
    } catch (e: any) {
      console.log(e.stack);
      console.log('ERROR', e.toString());
      await fs.promises.writeFile(errorFilename, e.toString());
      retries++;
    }
  }
  return false;
}

/*
if (recording === null) {
    console.log('recording not found', config.recording[i]);
    continue;
  }
  const missing: number[] = [];
  let id = 0;
  let offset = 0;
  let total = 0;

  while (true) {
    console.log('offset', offset);
    const files = await client.file.findMany({
      where: {
        recordingId: config.recording[i],
      },
      orderBy: {
        seq: 'asc',
      },
      skip: offset,
      take: 1000,
    });


    console.log(
      'files',
      files.length,
      files.map((f) => f.seq)
    );


    total += files.length;
    if (files.length === 0) break;

    for (let i = 0; i < files.length; ++i) {
      const f = files[i];
      if (f.seq > id) {
        for (let ii = id; ii < f.seq; ++ii) {
          missing.push(ii);
        }
      }
      id = f.seq + 1;
    }
    offset += files.length;
  }

  console.log('missing', missing);
  if (missing.length > 0) {
    await findMissing(recording, total, missing);
  }
}
pool.end();

async function findMissing(
  recording: Recording,
  total: number,
  missing: number[]
): Promise<void> {
  const result: number[] = Array.from({ length: missing.length }, (x, i) => -1);

  console.log('find', recording.site_id.substring(5));
  const recordings = await pool.query(
    'SELECT * FROM recording WHERE streamid = $1',
    [recording.site_id.substring(5)]
  );

  const ids = recordings.rows.map((r) => r.id);

  for (let i = 0; i < missing.length; ++i) {
    const found = await pool.query(
      'SELECT * FROM file WHERE seq = $1 AND recording_id = ANY($2::int[])',
      [missing[i], ids]
    );
    console.log(found.rows);
    let file = {
      recordingId: recording.id,
      datetime: recording.start,
      timeOffset: 0,
      name: missing[i].toString().padStart(5, '0') + '.ts',
      seq: missing[i],
      duration: 2,
      retries: 0,
      size: 0,
      downloaded: 0,
      hash: '',
      status: FileStatus.done,
    };

    if (found.rows.length > 0) {
      file.datetime = found.rows[0].datetime;
      file.duration = found.rows[0].duration;
      file.downloaded = found.rows[0].downloaded;
      file.size = found.rows[0].size;
    }

    const result = await client.file.create({
      data: {
        ...file,
      },
    });
    console.log('result', result);
  }

  // fist assumes ever duration is 2 seconds
  // and set offset at seq*2
  await client.$queryRaw`UPDATE file set time_offset = seq*2 WHERE recording_id = ${recording.id}`;

  // find duration that are not 2 seconds
  const not2 = await client.file.findMany({
    where: {
      AND: {
        duration: {
          not: 2,
        },
        recordingId: recording.id,
      },
    },
    orderBy: {
      seq: 'asc',
    },
  });

  console.log('not2', not2);

  // return of nothing found
  if (not2.length === 0) {
    console.log('no not2 found???');
    return;
  }

  const idx = not2[0].seq + 1;
  let offset = Number(not2[0].timeOffset) + Number(not2[0].duration);

  for (let i = idx; i < total; ++i) {
    console.log('update', i, offset);
    const data = await client.file.update({
      data: {
        timeOffset: offset,
      },
      where: {
        recordingId_name: {
          recordingId: recording.id,
          name: i.toString().padStart(5, '0') + '.ts',
        },
      },
    });
    if (!data) break;
    offset += Number(data.duration);
  }
}

*/
