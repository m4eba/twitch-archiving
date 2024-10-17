import type { ArgumentConfig } from 'ts-command-line-args';

export interface Env2ArgOptions {
  seperator?: string;
  nameTranslate?: (name: string) => string;
}

const defaultOptions: Env2ArgOptions = {
  seperator: ',',
  nameTranslate: (name: string) => {
    let result = '';
    for (let i = 0; i < name.length; ++i) {
      const c = name.charAt(i);
      if (c.toUpperCase() === c) {
        result += '_';
      }
      result += c.toUpperCase();
    }
    return result;
  },
};

export function env2arg<T extends { [name: string]: any }>(
  config: ArgumentConfig<T>,
  options?: Env2ArgOptions
): string[] {
  const opt = {
    ...defaultOptions,
    ...options,
  };
  if (!opt.nameTranslate || !opt.seperator) return [];
  const args: string[] = [];

  for (const [key, value] of Object.entries(config)) {
    const name = opt.nameTranslate(key);
    let v = process.env[name];
    if (v) {
      let va = [v];
      if (value.multiple) {
        va = v.split(opt.seperator);
      }
      va.forEach((value) => {
        args.push(`--${key}=${value}`);
      });
    }
  }

  return args;
}
