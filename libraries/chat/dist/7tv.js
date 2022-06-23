import fetch from 'node-fetch';
export async function channelEmotes(channel) {
    return getUrl(`https://api.7tv.app/v2/users/${channel}/emotes`);
}
export async function globalEmotes() {
    return getUrl('https://api.7tv.app/v2/emotes/global');
}
async function getUrl(url) {
    const resp = await fetch(url);
    const data = (await resp.json());
    const emotes = [];
    for (let i = 0; i < data.length; ++i) {
        const e = data[i];
        e.urls.forEach((url) => {
            emotes.push({
                id: e.id,
                source: '7tv',
                name: e.name,
                ext: e.mime.substring(6),
            });
        });
    }
    return { data, emotes };
}
