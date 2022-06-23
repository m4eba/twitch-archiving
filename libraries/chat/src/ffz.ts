import fetch from 'node-fetch';
import type { Emote } from './';

export async function channelEmotes(
  channel: string
): Promise<{ data: any; emotes: Emote[] }> {
  const resp = await fetch(`https://api.frankerfacez.com/v1/room/${channel}`);
  const data = (await resp.json()) as any;
  // remove usage count from data
  const result = new Array<Emote>();
  if (!data.sets) return { data: {}, emotes: [] };
  for (const key in data.sets) {
    if (Object.prototype.hasOwnProperty.call(data.sets, key)) {
      const set = data.sets[key];
      for (let i = 0; i < set.emoticons.length; ++i) {
        const e = set.emoticons[i];
        result.push({
          id: e.id,
          source: 'ffz',
          name: e.name,
          ext: 'png',
        });
      }
    }
  }

  return { data, emotes: result };
}
