import fetch from 'node-fetch';
function getEmotes(emotes) {
    const result = [];
    for (let i = 0; i < emotes.length; ++i) {
        const e = emotes[i];
        [1, 2, 3].forEach((zoom) => {
            result.push({
                id: e.id,
                name: e.code,
                source: 'bttv',
                ext: e.imageType,
            });
        });
    }
    return result;
}
export async function channelEmotes(id) {
    const resp = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${id}`);
    const data = (await resp.json());
    let result = getEmotes(data.channelEmotes);
    result = result.concat(getEmotes(data.sharedEmotes));
    return { data, emotes: result };
}
export async function globalEmotes() {
    const resp = await fetch('https://api.betterttv.net/3/cached/emotes/global');
    const data = (await resp.json());
    const emotes = getEmotes(data);
    return { data, emotes };
}
