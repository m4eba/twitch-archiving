import fetch from 'node-fetch';
import type { Response } from 'node-fetch';
import AbortController from 'abort-controller';

export async function fetchWithTimeoutText(
  url: string,
  retries: number = 5,
  timeout: number = 5000,
  headers: { [key: string]: string } = {}
): Promise<{ data: string; resp: Response }> {
  return new Promise((resolve, reject) => {
    const abort = new AbortController();
    const timer = setTimeout(() => {
      abort.abort();
    }, timeout);
    fetch(url, {
      signal: abort.signal,
      headers,
    })
      .then((resp: Response) => {
        return resp.text().then((d) => ({ data: d, resp }));
      })
      .then(resolve)
      .catch((e) => {
        if (retries > 0) {
          fetchWithTimeoutText(url, retries - 1, timeout, headers)
            .then(resolve)
            .catch(reject);
        } else {
          reject(e);
        }
      })
      .finally(() => {
        clearTimeout(timer);
      });
  });
}

export async function fetchWithTimeout(
  url: string,
  retries: number = 5,
  timeout: number = 5000
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const abort = new AbortController();
    const timer = setTimeout(() => {
      abort.abort();
    }, timeout);
    fetch(url, {
      signal: abort.signal,
    })
      .then((resp: Response) => {
        clearTimeout(timer);
        resolve(resp);
      })
      .catch((e) => {
        if (retries === 0) {
          reject(e);
          return;
        }
        fetchWithTimeout(url, retries - 1, timeout)
          .then(resolve)
          .catch(reject);
      })
      .finally(() => {
        clearTimeout(timer);
      });
  });
}
