import type { EmoteData } from '.';

export function parseIrcMessageEmoteTag(msg: string, tag: string): EmoteData[] {
  // example emotesv2_432ba07bfc2743e9aa2a6916e000681e:0-5,7-12/301592569:14-17
  const emotes = tag.split('/');
  const result: EmoteData[] = [];
  emotes.forEach((e) => {
    if (e.length === 0) return;
    const s = e.split(':');
    if (s.length < 2) return;
    const each = s[1].split(',');
    each.forEach((e) => {
      const idx = e.split('-');
      if (e.length < 2) return;
      const start_idx = parseInt(idx[0]);
      const end_idx = parseInt(idx[1]);
      const name = msg.substring(start_idx, end_idx);
      const data: EmoteData = {
        id: s[0],
        source: 'twitch',
        name,
        ext: '',
        start_idx,
        end_idx,
      };
      result.push(data);
    });
  });
  return result;
}
