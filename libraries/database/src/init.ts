import type { PostgresConfig, RedisConfig } from '@twitch-archiving/config';
import type { Pool } from 'pg';
import type { Logger } from 'pino';
import pg from 'pg';
import { createClient } from 'redis';
import { initLogger } from '@twitch-archiving/utils';
import { RecPrismaClient } from '@twitch-archiving/prisma';

const logger: Logger = initLogger('database-init');

const recPrismaClient = new RecPrismaClient();

export function getRecPrismaClient(): RecPrismaClient {
  return recPrismaClient;
}

export type RedisClient = ReturnType<typeof createClient>;

let pool: Pool | undefined = undefined;
let redis: RedisClient | undefined = undefined;
let redisPrefix: string = '';

// see https://github.com/brianc/node-postgres/issues/811#issuecomment-488374261
pg.types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

export function getPool(): Pool | undefined {
  return pool;
}

export function getRedis(): RedisClient | undefined {
  return redis;
}

export function getRedisPrefix(): string {
  return redisPrefix;
}

export function getPR(): { pool: Pool; redis: RedisClient; prefix: string } {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  const redis = getRedis();
  if (redis === undefined) throw new Error('redis not initialized');
  return {
    pool,
    redis,
    prefix: getRedisPrefix(),
  };
}

export function getR(): { redis: RedisClient; prefix: string } {
  const redis = getRedis();
  if (redis === undefined) throw new Error('redis not initialized');
  return {
    redis,
    prefix: getRedisPrefix(),
  };
}

export function getP(): { pool: Pool } {
  const pool = getPool();
  if (pool === undefined) throw new Error('database not initialized');
  return {
    pool,
  };
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
  if (p !== undefined) {
    p.on('error', (err: Error) => {
      logger.error(err);
    });
  }
}

export async function closePostgres(): Promise<void> {
  if (pool !== undefined) {
    await pool.end();
  }
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
