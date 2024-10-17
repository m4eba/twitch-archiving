import fs from 'fs';
import path from 'path';
import {
  FileConfig,
  FileConfigOpt,
  PostgresConfig,
  PostgresConfigOpt,
} from '@twitch-archiving/config';
import type { Logger } from 'pino';

import { ArgumentConfig, parse } from 'ts-command-line-args';
import { initLogger, fileExists, env2arg } from '@twitch-archiving/utils';
import { RecPrismaClient } from '@twitch-archiving/prisma';

interface ToolConfig {
  reportPath: string;
  logPath: string[];
}

const ToolConfigOpt: ArgumentConfig<ToolConfig> = {
  reportPath: { type: String },
  logPath: { type: String, multiple: true },
};

interface Config extends ToolConfig, PostgresConfig, FileConfig {}

const argConf: ArgumentConfig<Config> = {
  ...ToolConfigOpt,
  ...PostgresConfigOpt,
  ...FileConfigOpt,
};

export default async function main(args: string[]) {
  const eargs = env2arg<Config>(argConf);
  const config: Config = parse<Config>(argConf, {
    loadFromFileArg: 'config',
    argv: [...eargs, ...args],
  });
  const logger: Logger = initLogger('copy-playlist-log');

  const client = new RecPrismaClient();

  function isDateMatch(
    filename: string,
    year: number,
    month: number,
    day: number
  ): boolean {
    // Function to pad single digit numbers with leading zero
    const padZero = (num: number) => num.toString().padStart(2, '0');

    // Generate the date strings for the current, previous, and next day
    const currentDate = `${year}-${padZero(month)}-${padZero(day)}`;
    const previousDate = new Date(Date.UTC(year, month - 1, day - 1));
    const nextDate = new Date(Date.UTC(year, month - 1, day + 1));

    const previousDateString = `${previousDate.getUTCFullYear()}-${padZero(
      previousDate.getUTCMonth() + 1
    )}-${padZero(previousDate.getUTCDate())}`;
    const nextDateString = `${nextDate.getUTCFullYear()}-${padZero(
      nextDate.getUTCMonth() + 1
    )}-${padZero(nextDate.getUTCDate())}`;

    // Check if the filename starts with any of the date strings
    return (
      filename.startsWith(currentDate) ||
      filename.startsWith(previousDateString) ||
      filename.startsWith(nextDateString)
    );
  }

  async function checkErrorFile(folder: string) {
    const name = path.join(config.reportPath, folder, 'error.txt');
    if (!(await fileExists(name))) return;
    const data = await fs.promises.readFile(name, 'utf8');
    if (data.includes('duration')) {
      const recording = await client.recording.findFirst({
        where: {
          site_id: folder,
          stop: {
            not: null,
          },
        },
      });
      if (!recording) {
        console.log('recording not found');
        process.exit(1);
      }
      console.log('duration diff for', recording);
      const date = recording.start;
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();

      for (const logPath of config.logPath) {
        const log = path.join(
          logPath,
          year.toString(),
          month.toString().padStart(2, '0')
        );
        if (!(await fileExists(log))) continue;

        const logFiles = await fs.promises.readdir(log);

        for (const f of logFiles) {
          if (!f.endsWith('stream.json')) continue;
          if (!isDateMatch(f, year, month, day)) continue;
          const obj = JSON.parse(
            await fs.promises.readFile(path.join(log, f), 'utf8')
          );
          if ('live-' + obj.id === folder) {
            console.log('found', obj);
            await fs.promises.copyFile(
              path.join(log, f.replace('-stream.json', '-playlist.log')),
              path.join(config.reportPath, folder, 'playlist.log')
            );
          }
        }
      }
    }
  }

  const files = await fs.promises.readdir(config.reportPath);

  for (const file of files) {
    console.log('check stream', file);
    await checkErrorFile(file);
  }
}
