import type { Response } from 'node-fetch';
export declare function fetchWithTimeout(url: string, retries?: number, timeout?: number): Promise<Response>;
