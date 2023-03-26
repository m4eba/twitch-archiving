import fetch from 'node-fetch';
import url from 'url';
import type { AccessToken } from '@twitch-archiving/model';
import { fetchWithTimeoutText } from '@twitch-archiving/utils';

export async function getMainPlaylist(
  endpoint: string,
  token: AccessToken
): Promise<string> {
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

export async function getLivePlaylist(
  channel: string,
  token: AccessToken
): Promise<string> {
  return getMainPlaylist(
    `https://usher.ttvnw.net/api/channel/hls/${channel}.m3u8`,
    token
  );
}

export async function getVodPlaylist(
  vodId: string,
  token: AccessToken
): Promise<string> {
  return getMainPlaylist(`https://usher.ttvnw.net/vod/${vodId}.m3u8`, token);
}
