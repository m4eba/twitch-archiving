import fetch from 'node-fetch';
import type { Emote } from '.';

function getEmotes(
  emotes: Array<{ id: string; code: string; imageType: string }>
): Array<Emote> {
  const result: Array<Emote> = [];
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

export async function channelEmotes(
  id: string
): Promise<{ data: any; emotes: Emote[] }> {
  const resp = await fetch(
    `https://api.betterttv.net/3/cached/users/twitch/${id}`
  );
  const data = (await resp.json()) as any;
  let result = getEmotes(data.channelEmotes);
  result = result.concat(getEmotes(data.sharedEmotes));

  return { data, emotes: result };
}

export async function globalEmotes(): Promise<{ data: any; emotes: Emote[] }> {
  const resp = await fetch('https://api.betterttv.net/3/cached/emotes/global');
  const data = (await resp.json()) as any;
  const emotes = getEmotes(data);
  return { data, emotes };
}
