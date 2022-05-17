import process from 'process';
import pino, { Logger } from 'pino';

export function initLogger(module: string): Logger {
  // eslint-disable-next-line dot-notation
  let level = process.env['LOG_LEVEL'];
  if (level === undefined) {
    level = 'info';
  }
  return pino({ level }).child({
    module,
  });
}
