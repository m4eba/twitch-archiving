import type { AccessToken } from '@twitch-archiving/messages';
export declare const DEFAULT_PLAYER_TYPE: string;
export interface AccessTokenParams {
    isLive: boolean;
    isVod: boolean;
    login: string;
    playerType: string;
    vodID: string;
}
export declare function getAccessToken(params: AccessTokenParams, oauthVideo: string): Promise<AccessToken>;
//# sourceMappingURL=acesstoken.d.ts.map