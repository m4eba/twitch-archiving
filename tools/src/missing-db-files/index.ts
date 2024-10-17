import fs from 'fs';
import path from 'path';
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
import { initLogger, fileExists, env2arg } from '@twitch-archiving/utils';
import { getP, initPostgres } from '@twitch-archiving/database';
import {
  FileStatus,
  Recording,
} from '@twitch-archiving/prisma/prisma/generated/rec-client/index.js';

interface PlaylistConfig {
  recording: number[];
}

const PlaylistConfigOpt: ArgumentConfig<PlaylistConfig> = {
  recording: { type: Number, multiple: true },
};
console.log(process.env.REC_DATABASE_URL);
interface Config extends PlaylistConfig, PostgresConfig, FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...PlaylistConfigOpt,
  ...PostgresConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });

  const logger: Logger = initLogger('missing-db-files');

  await initPostgres(config);
  const { pool } = getP();
  const client = new RecPrismaClient();

  for (let i = 0; i < config.recording.length; ++i) {
    const recording = await client.recording.findUnique({
      where: {
        id: config.recording[i],
      },
    });
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

      /*
    console.log(
      'files',
      files.length,
      files.map((f) => f.seq)
    );
    */

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
    const result: number[] = Array.from(
      { length: missing.length },
      (x, i) => -1
    );

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
}
