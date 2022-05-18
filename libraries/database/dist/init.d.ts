import type { PostgresConfig } from '@twitch-archiving/config';
import type { Pool } from 'pg';
export declare function getPool(): Pool | undefined;
export declare function init(config: PostgresConfig): Promise<void>;
