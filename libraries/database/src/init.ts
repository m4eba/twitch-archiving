import type { PostgresConfig } from '@twitch-archiving/config';
import { Pool } from 'pg';

let pool: Pool | undefined = undefined;

export function getPool(): Pool | undefined {
  return pool;
}

export async function init(config: PostgresConfig): Promise<void> {
  let p: Pool | undefined = undefined;

  try {
    p = new Pool({
      host: config.pgHost,
      user: config.pgUser,
      password: config.pgPassword,
      port: config.pgPort,
      database: config.pgDatabase,
    });

    // make one query to test for database
    await p.query('select 1');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    p = undefined;
    if (
      e.toString() === `error: database "${config.pgDatabase}" does not exist`
    ) {
      console.log('create database');
      p = new Pool({
        host: config.pgHost,
        user: config.pgUser,
        password: config.pgPassword,
        port: config.pgPort,
      });
      await p.query(`CREATE DATABASE ${config.pgDatabase}`);
      await p.end();
      p = new Pool({
        host: config.pgHost,
        user: config.pgUser,
        password: config.pgPassword,
        port: config.pgPort,
        database: config.pgDatabase,
      });
    }
  } //catch block

  pool = p;
}
