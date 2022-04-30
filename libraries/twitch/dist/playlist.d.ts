import type { AccessToken } from '.';
export declare function getMainPlaylist(endpoint: string, token: AccessToken): Promise<string>;
export declare function getLivePlaylist(channel: string, token: AccessToken): Promise<string>;
