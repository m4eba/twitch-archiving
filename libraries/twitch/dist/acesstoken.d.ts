export interface AccessToken {
    token: string;
    sig: string;
    expires_at: string;
}
export declare const DEFAULT_PLAYER_TYPE: string;
export interface AccessTokenParams {
    isLive: boolean;
    isVod: boolean;
    login: string;
    playerType: string;
    vodID: string;
}
export declare function getAccessToken(params: AccessTokenParams, oauthVideo: string): Promise<AccessToken>;
