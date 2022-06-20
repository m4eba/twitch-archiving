import type { Response } from 'node-fetch';
export declare function fetchWithTimeoutText(url: string, retries?: number, timeout?: number): Promise<{
    data: string;
    resp: Response;
}>;
export declare function fetchWithTimeout(url: string, retries?: number, timeout?: number): Promise<Response>;
