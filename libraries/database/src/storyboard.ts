import type { Logger } from 'pino';
import { initLogger } from '@twitch-archiving/utils';

const logger: Logger = initLogger('database-storyboard');

export interface ScreenshotData {
  sequence: number;
  index: number;
  offset: number;
}
