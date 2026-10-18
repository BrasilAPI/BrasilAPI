/**
 * lib/http/transport.js
 * Camada de transporte: Got 11 → HttpClientError.
 * Nunca lança por status HTTP (lança apenas por erros de rede/timeout/abort).
 */

import got from 'got';
import { fromGotError, canceledError } from './errors.js';

const STATUS_TEXTS = {
  200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently',
  302: 'Found', 303: 'See Other', 304: 'Not Modified', 307: 'Temporary Redirect',
  308: 'Permanent Redirect', 400: 'Bad Request', 401: 'Unauthorized',
  403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed',
  429: 'Too Many Requests', 500: 'Internal Server Error', 502: 'Bad Gateway',
  503: 'Service Unavailable', 504: 'Gateway Timeout',
};

function statusText(status) {
  return STATUS_TEXTS[status] || '';
}

/**
 * createDeadline — relógio de parede compartilhado entre saltos.
 * O relógio começa na primeira chamada a remaining().
 * Se timeoutMs for falsy (0, null, undefined), retorna Infinity.
 */
export function createDeadline(timeoutMs) {
  if (!timeoutMs) {
    return { remaining: () => Infinity };
  }
  let startedAt = null;
  return {
    remaining() {
      if (startedAt === null) startedAt = Date.now();
      const elapsed = Date.now() - startedAt;
      return Math.max(0, timeoutMs - elapsed);
    },
  };
}

/**
 * send — faz um único envio HTTP com Got 11.
 * hopReq: { method, url, headers, body?, timeout, signal? }
 * Retorna: { status, statusText, headers, body: Buffer, url }
 * Nunca lança por status HTTP.
 */
export async function send(hopReq, deadline) {
  const { method, url, headers, body, signal } = hopReq;
  const remaining = deadline.remaining();

  // Detecta abort antes de iniciar
  if (signal && signal.aborted) {
    throw canceledError(hopReq);
  }

  const gotInstance = got.extend({
    throwHttpErrors: false,
    retry: { limit: 0 },
    followRedirect: false,
    responseType: 'buffer',
    decompress: true,
    http2: false,
  });

  const gotOptions = {
    method,
    headers,
    body,
    timeout: remaining === Infinity ? undefined : { request: remaining },
  };

  let cancelTimer;
  let promise;

  try {
    promise = gotInstance(url, gotOptions);

    // Arma timeout de parede (para o caso do Got não cancelar no tempo certo)
    if (remaining !== Infinity && remaining > 0) {
      cancelTimer = setTimeout(() => {
        if (promise && promise.cancel) promise.cancel('wall-clock timeout');
      }, remaining + 50); // pequena margem
    }

    // Ponte AbortSignal → promise.cancel()
    let abortListener;
    if (signal) {
      abortListener = () => {
        if (promise && promise.cancel) promise.cancel('aborted');
      };
      signal.addEventListener('abort', abortListener);
    }

    let response;
    try {
      response = await promise;
    } finally {
      if (cancelTimer) clearTimeout(cancelTimer);
      if (signal && abortListener) signal.removeEventListener('abort', abortListener);
    }

    // Verifica abort pós-resposta
    if (signal && signal.aborted) {
      throw canceledError(hopReq);
    }

    return {
      status: response.statusCode,
      statusText: statusText(response.statusCode),
      headers: response.headers,
      body: response.body,
      url: response.url || url,
    };
  } catch (err) {
    if (cancelTimer) clearTimeout(cancelTimer);

    // Se já é HttpClientError (ex: canceledError acima), propaga direto
    if (err && err.isHttpClientError) throw err;

    throw fromGotError(err, method, url);
  }
}
