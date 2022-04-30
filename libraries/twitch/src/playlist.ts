import fetch from 'node-fetch';
import url from 'url';
import type { AccessToken } from '.';

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

  const resp = await fetch(uri.toString());
  const text = await resp.text();
  return text;
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
