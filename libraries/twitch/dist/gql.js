import fetch from 'node-fetch';
const ClientID = 'jzkbprff40iqj646a697cyrvl0zt2m6';
export const VideoAccessToken_Clip = (slug) => {
    return {
        operationName: 'VideoAccessToken_Clip',
        variables: { slug },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11',
            },
        },
    };
};
export const WatchLivePrompt = (slug) => {
    return {
        operationName: 'WatchLivePrompt',
        variables: { slug },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: 'd65226c25ec2335f7550351c7041f4080a2531f4e330375fef45c7a00e4f4016',
            },
        },
    };
};
export const ClipsFullVideoButton = (slug) => {
    return {
        operationName: 'ClipsFullVideoButton',
        variables: { slug },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: 'd519a5a70419d97a3523be18fe6be81eeb93429e0a41c3baa9441fc3b1dffebf',
            },
        },
    };
};
export const ClipsChatReplay = (slug, offset) => {
    return {
        operationName: 'ClipsChatReplay',
        variables: { slug, videoOffsetSeconds: offset },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: '05bb2716e4760d4c5fc03111a5afe9b0ab69fc875e9b65ea8a63bbc34d5af21d',
            },
        },
    };
};
export async function gql(req) {
    const resp = await fetch('https://gql.twitch.tv/gql', {
        method: 'POST',
        headers: {
            Accept: 'application/vnd.twitchtv.v5+json',
            'Client-Id': ClientID,
            //Authorization: 'Bearer ' + access_token,
        },
        body: JSON.stringify(req),
    });
    return await resp.json();
}
