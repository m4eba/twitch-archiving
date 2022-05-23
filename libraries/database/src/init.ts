import type { PostgresConfig, RedisConfig } from '@twitch-archiving/config';
import type { Pool } from 'pg';
import pg from 'pg';
import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

let pool: Pool | undefined = undefined;
let redis: RedisClient | undefined = undefined;
let redisPrefix: string = '';

export function getPool(): Pool | undefined {
  return pool;
}

export function getRedis(): RedisClient | undefined {
  return redis;
}

export function getRedisPrefix(): string {
  return redisPrefix;
}

export async function initPostgres(config: PostgresConfig): Promise<void> {
  let p: Pool | undefined = undefined;

  try {
    p = new pg.Pool({
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
      p = new pg.Pool({
        host: config.pgHost,
        user: config.pgUser,
        password: config.pgPassword,
        port: config.pgPort,
      });
      await p.query(`CREATE DATABASE ${config.pgDatabase}`);
      await p.end();
      p = new pg.Pool({
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

export async function initRedis(
  config: RedisConfig,
  prefix: string
): Promise<void> {
  redisPrefix = prefix;
  redis = createClient({
    url: config.redisUrl,
  });
  await redis.connect();
}
