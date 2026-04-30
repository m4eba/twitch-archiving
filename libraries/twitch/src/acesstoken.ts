import fetch from 'node-fetch';
import pino, { Logger } from 'pino';
import type { AccessToken } from '@twitch-archiving/model';

const logger: Logger = pino({ level: 'debug' }).child({
  module: 'twitch',
});

export const DEFAULT_PLAYER_TYPE: string = 'site';

export interface AccessTokenParams {
  isLive: boolean;
  isVod: boolean;
  login: string;
  playerType: string;
  vodID: string;
}

export async function getAccessToken(
  params: AccessTokenParams,
  oauthVideo: string
): Promise<AccessToken> {
  const p: AccessTokenParams = { ...params };
  if (p.playerType.length === 0) {
    p.playerType = DEFAULT_PLAYER_TYPE;
  }

  try {
    return await getAccessTokenPersisted(p, oauthVideo);
  } catch (e) {
    logger.debug({ err: e }, 'persisted access token query failed, falling back to template');
    return await getAccessTokenTemplate(p, oauthVideo);
  }
}

async function getAccessTokenPersisted(
  p: AccessTokenParams,
  oauthVideo: string
): Promise<AccessToken> {
  const req = [
    {
      operationName: 'PlaybackAccessToken',
      variables: p,
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            '0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712',
        },
      },
    },
  ];
  return await postAccessToken(req, oauthVideo);
}

async function getAccessTokenTemplate(
  p: AccessTokenParams,
  oauthVideo: string
): Promise<AccessToken> {
  const req = [
    {
      operationName: 'PlaybackAccessToken_Template',
      variables: { ...p, platform: 'web' },
      query:
        'query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!, $platform: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: $platform, playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isLive) {    value    signature   authorization { isForbidden forbiddenReasonCode }   __typename  }  videoPlaybackAccessToken(id: $vodID, params: {platform: $platform, playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isVod) {    value    signature   __typename  }}',
    },
  ];
  return await postAccessToken(req, oauthVideo);
}

async function postAccessToken(
  // eslint-disable-next-line
  req: any,
  oauthVideo: string
): Promise<AccessToken> {
  const headers: { [key: string]: string } = {
    //'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
    'Client-ID': 'ue6666qo983tsx6so1t0vnawi233wa',
    Accept: 'application/vnd.twitchtv.v5+json',
  };
  if (oauthVideo.length > 0) {
    // eslint-disable-next-line
    headers['Authorization'] = `OAuth ${oauthVideo}`;
  }
  logger.debug('gql accesstoken, headers %o', { headers });
  const resp = await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    headers,
    body: JSON.stringify(req),
  });
  // @ts-ignore
  // eslint-disable-next-line
  const result: any = await resp.json();

  try {
    const data: AccessToken = {
      sig: result[0].data.streamPlaybackAccessToken.signature,
      token: result[0].data.streamPlaybackAccessToken.value,
      expires_at: '',
    };
    return data;
  } catch (e) {
    console.log('unable to create access token', result);
    throw e;
  }
}
