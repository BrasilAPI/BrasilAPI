/**
 * lib/http/errors.js
 * HttpClientError — substituto do axios AxiosError/CanceledError.
 * Mantém compatibilidade de campos: code, request, response, status, name.
 */

export class HttpClientError extends Error {
  // opts: { code?, request?: { method, url }, response?: { status, statusText?, headers?, data },
  //         name?: string, cause?: unknown }
  constructor(message, { code, request, response, name = 'AxiosError', cause } = {}) {
    super(message);
    this.name = name;
    if (code !== undefined) this.code = code;
    if (request !== undefined) this.request = request;
    if (response !== undefined) {
      this.response = response;
      this.status = response.status;
    }
    if (cause !== undefined) {
      Object.defineProperty(this, 'cause', { value: cause, enumerable: false });
    }
  }
}

// No protótipo: isHttpClientError não aparece em spread do objeto de erro
HttpClientError.prototype.isHttpClientError = true;

export const isHttpClientError = (e) => Boolean(e) && e.isHttpClientError === true;

/**
 * Cria um HttpClientError a partir de um status HTTP não-2xx.
 */
export function fromStatus(method, url, status, statusText, headers, data) {
  return new HttpClientError(`Request failed with status code ${status}`, {
    request: { method, url },
    response: { status, statusText, headers, data },
  });
}

/**
 * Converte erros do Got (RequestError, TimeoutError, CancelError) em HttpClientError.
 */
export function fromGotError(err, method, url) {
  const req = { method, url };

  // CancelError do Got
  if (err.name === 'CancelError') {
    return new HttpClientError(err.message || 'canceled', {
      code: 'ERR_CANCELED',
      name: 'CanceledError',
      request: req,
      cause: err,
    });
  }

  // TimeoutError do Got
  if (err.name === 'TimeoutError') {
    return new HttpClientError(err.message || 'timeout of 0ms exceeded', {
      code: 'ETIMEDOUT',
      name: 'AxiosError',
      request: req,
      cause: err,
    });
  }

  // RequestError e outros erros de rede do Got
  const code = err.code || 'ERR_NETWORK';
  return new HttpClientError(err.message || 'Network Error', {
    code,
    name: 'AxiosError',
    request: req,
    cause: err,
  });
}

/**
 * Cria um erro de cancelamento (AbortSignal).
 */
export function canceledError(req) {
  return new HttpClientError('canceled', {
    code: 'ERR_CANCELED',
    name: 'CanceledError',
    request: req ? { method: req.method, url: req.url } : undefined,
  });
}

/**
 * Cria um erro de timeout.
 */
export function timeoutError(req) {
  return new HttpClientError('timeout exceeded', {
    code: 'ETIMEDOUT',
    name: 'AxiosError',
    request: req ? { method: req.method, url: req.url } : undefined,
  });
}
