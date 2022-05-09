import process from 'process';
import pino from 'pino';
export function initLogger(module) {
    // eslint-disable-next-line dot-notation
    let level = process.env['LOG_LEVEL'];
    if (level === undefined) {
        level = 'info';
    }
    return pino({ level: 'debug' }).child({
        module,
    });
}
