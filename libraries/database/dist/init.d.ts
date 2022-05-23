import type { PostgresConfig, RedisConfig } from '@twitch-archiving/config';
import type { Pool } from 'pg';
import { createClient } from 'redis';
export declare type RedisClient = ReturnType<typeof createClient>;
export declare function getPool(): Pool | undefined;
export declare function getRedis(): RedisClient | undefined;
export declare function getRedisPrefix(): string;
export declare function initPostgres(config: PostgresConfig): Promise<void>;
export declare function initRedis(config: RedisConfig, prefix: string): Promise<void>;
