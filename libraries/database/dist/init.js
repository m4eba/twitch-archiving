import pg from 'pg';
import { createClient } from 'redis';
import { initLogger } from '@twitch-archiving/utils';
const logger = initLogger('database-init');
let pool = undefined;
let redis = undefined;
let redisPrefix = '';
// see https://github.com/brianc/node-postgres/issues/811#issuecomment-488374261
pg.types.setTypeParser(1700, function (val) {
    return parseFloat(val);
});
export function getPool() {
    return pool;
}
export function getRedis() {
    return redis;
}
export function getRedisPrefix() {
    return redisPrefix;
}
export function getPR() {
    const pool = getPool();
    if (pool === undefined)
        throw new Error('database not initialized');
    const redis = getRedis();
    if (redis === undefined)
        throw new Error('redis not initialized');
    return {
        pool,
        redis,
        prefix: getRedisPrefix(),
    };
}
export function getR() {
    const redis = getRedis();
    if (redis === undefined)
        throw new Error('redis not initialized');
    return {
        redis,
        prefix: getRedisPrefix(),
    };
}
export function getP() {
    const pool = getPool();
    if (pool === undefined)
        throw new Error('database not initialized');
    return {
        pool,
    };
}
export async function initPostgres(config) {
    let p = undefined;
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
    }
    catch (e) {
        p = undefined;
        if (e.toString() === `error: database "${config.pgDatabase}" does not exist`) {
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
        p.on('error', (err) => {
            logger.error(err);
        });
    }
}
export async function closePostgres() {
    if (pool !== undefined) {
        await pool.end();
    }
}
export async function initRedis(config, prefix) {
    redisPrefix = prefix;
    redis = createClient({
        url: config.redisUrl,
    });
    await redis.connect();
}
