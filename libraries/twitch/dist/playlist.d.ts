import type { AccessToken } from '@twitch-archiving/model';
export declare function getMainPlaylist(endpoint: string, token: AccessToken): Promise<string>;
export declare function getLivePlaylist(channel: string, token: AccessToken): Promise<string>;
export declare function getVodPlaylist(vodId: string, token: AccessToken): Promise<string>;
//# sourceMappingURL=playlist.d.ts.map