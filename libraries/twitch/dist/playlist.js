import url from 'url';
import { fetchWithTimeoutText } from '@twitch-archiving/utils';
export async function getMainPlaylist(endpoint, token) {
    const uri = new url.URL(endpoint);
    uri.searchParams.append('player', 'twitchweb');
    uri.searchParams.append('p', Math.trunc(Math.random() * 999999).toString());
    uri.searchParams.append('type', 'any');
    uri.searchParams.append('allow_source', 'true');
    uri.searchParams.append('allow_spectre', 'false');
    uri.searchParams.append('sig', token.sig);
    uri.searchParams.append('token', token.token);
    const { data, resp } = await fetchWithTimeoutText(uri.toString(), 3, 2000);
    if (resp.status !== 200) {
        return '';
    }
    return data;
}
export async function getLivePlaylist(channel, token) {
    return getMainPlaylist(`https://usher.ttvnw.net/api/channel/hls/${channel}.m3u8`, token);
}
export async function getVodPlaylist(vodId, token) {
    return getMainPlaylist(`https://usher.ttvnw.net/vod/${vodId}.m3u8`, token);
}
