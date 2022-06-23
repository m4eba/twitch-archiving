import fetch from 'node-fetch';
import type { Emote } from './';

export async function channelEmotes(
  channel: string
): Promise<{ data: any; emotes: Emote[] }> {
  return getUrl(`https://api.7tv.app/v2/users/${channel}/emotes`);
}

export async function globalEmotes(): Promise<{ data: any; emotes: Emote[] }> {
  return getUrl('https://api.7tv.app/v2/emotes/global');
}

async function getUrl(url: string): Promise<{ data: any; emotes: Emote[] }> {
  const resp = await fetch(url);
  const data = (await resp.json()) as any[];
  const emotes: Array<Emote> = [];
  for (let i = 0; i < data.length; ++i) {
    const e = data[i];

    e.urls.forEach((url: string[2]) => {
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
