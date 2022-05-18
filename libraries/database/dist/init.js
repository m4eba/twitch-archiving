import pg from 'pg';
let pool = undefined;
export function getPool() {
    return pool;
}
export async function init(config) {
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
}
