import fetch from 'node-fetch';
import pino from 'pino';
const logger = pino({ level: 'debug' }).child({
    module: 'twitch',
});
export const DEFAULT_PLAYER_TYPE = 'site';
export async function getAccessToken(params, oauthVideo) {
    const p = { ...params };
    if (p.playerType.length === 0) {
        p.playerType = DEFAULT_PLAYER_TYPE;
    }
    const req = [
        {
            operationName: 'PlaybackAccessToken',
            variables: p,
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712',
                },
            },
        },
    ];
    const headers = {
        'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
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
    const result = await resp.json();
    try {
        const data = {
            sig: result[0].data.streamPlaybackAccessToken.signature,
            token: result[0].data.streamPlaybackAccessToken.value,
            expires_at: '',
        };
        return data;
    }
    catch (e) {
        console.log('unable to create access token', result);
        throw e;
    }
}
