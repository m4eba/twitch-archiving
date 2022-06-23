export class Resolver {
    constructor() {
        this.global = new Map();
        this.channel = new Map();
    }
    setGlobal(emotes) {
        this.global.clear();
        emotes.forEach((e) => this.global.set(e.name, e));
    }
    setEmotes(channel, emotes) {
        const m = new Map();
        emotes.forEach((e) => m.set(e.name, e));
        this.channel.set(channel, m);
    }
    hasEmotes(channel) {
        return this.channel.has(channel);
    }
    resolve(channel, text) {
        const result = [];
        const inst = this;
        function test(start_idx, end_idx, token) {
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
            if (c === undefined)
                return;
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
            if (next === -1)
                break;
            test(idx + 1, next - 2, text.substring(idx + 1, next));
            idx = next;
        }
        if (f1) {
            test(idx + 1, text.length - 1, text.substring(idx + 1));
        }
        return result;
    }
}
