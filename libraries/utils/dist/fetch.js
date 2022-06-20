import fetch from 'node-fetch';
import AbortController from 'abort-controller';
export async function fetchWithTimeoutText(url, retries = 5, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const abort = new AbortController();
        const timer = setTimeout(() => {
            abort.abort();
        }, timeout);
        fetch(url, {
            signal: abort.signal,
        })
            .then((resp) => {
            resp
                .text()
                .then(resolve)
                .catch((e) => {
                if (retries === 0) {
                    reject(e);
                    return;
                }
                fetchWithTimeoutText(url, retries - 1, timeout)
                    .then(resolve)
                    .catch(reject);
            });
        })
            .catch((e) => {
            if (retries === 0) {
                reject(e);
                return;
            }
            fetchWithTimeoutText(url, retries - 1, timeout)
                .then(resolve)
                .catch(reject);
        })
            .finally(() => {
            clearTimeout(timer);
        });
    });
}
export async function fetchWithTimeout(url, retries = 5, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const abort = new AbortController();
        const timer = setTimeout(() => {
            abort.abort();
        }, timeout);
        fetch(url, {
            signal: abort.signal,
        })
            .then((resp) => {
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
