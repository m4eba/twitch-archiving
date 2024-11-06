import fetch from 'node-fetch';
import type { Emote } from '.';

export interface Emote7tv {
  id: string;
  name: string;
  data: {
    host: {
      url: string;
      files: {
        name: string;
      }[];
    };
  };
}

export interface EmoteSet7tv {
  emotes: Emote7tv[];
}

export function extractEmoteSet(set: EmoteSet7tv): Emote[] {
  const result: Emote[] = [];
  set.emotes.forEach((e) => {
    result.push({
      id: e.id,
      source: '7tv',
      name: e.name,
      ext: 'webp',
    });
  });
  return result;
}

export async function channelEmotes(
  id: string
): Promise<{ data: any; emotes: Emote[] }> {
  const resp = await fetch(`https://7tv.io/v3/users/twitch/${id}`);
  const data = (await resp.json()) as any;
  const result: Array<Emote> = extractEmoteSet(data.emote_set);
  return { data, emotes: result };
}

export async function globalEmotes(): Promise<{ data: any; emotes: Emote[] }> {
  const resp = await fetch('https://7tv.io/v3/emote-sets/global');
  const data = (await resp.json()) as any;
  const result: Array<Emote> = extractEmoteSet(data);
  return { data, emotes: result };
}
