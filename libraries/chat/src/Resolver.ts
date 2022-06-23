import type { Emote, EmoteData } from '.';

type EmoteMap = Map<string, Emote>;

export class Resolver {
  private global: EmoteMap = new Map();
  private channel: Map<string, EmoteMap> = new Map();

  constructor() {}

  public setGlobal(emotes: Emote[]) {
    this.global.clear();
    emotes.forEach((e) => this.global.set(e.name, e));
  }

  public setEmotes(channel: string, emotes: Emote[]) {
    const m: EmoteMap = new Map();
    emotes.forEach((e) => m.set(e.name, e));
    this.channel.set(channel, m);
  }

  public hasEmotes(channel: string): boolean {
    return this.channel.has(channel);
  }

  public resolve(channel: string, text: string): EmoteData[] {
    const result: EmoteData[] = [];

    const inst = this;
    function test(start_idx: number, end_idx: number, token: string): void {
      const g = inst.global.get(token);
      if (g !== undefined) {
        result.push({
          ...g,
          start_idx,
          end_idx,
        });
        return;
      }
      const c = inst.channel.get(channel);
      if (c === undefined) return;
      const e = c.get(token);
      if (e !== undefined) {
        result.push({
          ...e,
          start_idx,
          end_idx,
        });
        return;
      }
    }

    let idx = text.indexOf(' ', 0);
    let next = 0;
    if (idx === -1) {
      test(0, text.length - 1, text);
      return result;
    }
    test(0, idx - 1, text.substring(0, idx));
    const f1 = idx > -1;

    while (idx > -1) {
      next = text.indexOf(' ', idx + 1);
      if (next === -1) break;
      test(idx + 1, next - 2, text.substring(idx + 1, next));
      idx = next;
    }
    if (f1) {
      test(idx + 1, text.length - 1, text.substring(idx + 1));
    }
    return result;
  }
}
