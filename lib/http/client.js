/**
 * lib/http/client.js
 * API pública do cliente HTTP — substituto do axios com semântica idêntica.
 * Objeto NÃO congelado para permitir vi.spyOn(httpClient, 'get').
 */

import { buildUrl, encodeBody, decodeBody } from './codec.js';
import { send, createDeadline } from './transport.js';
import { follow } from './redirects.js';
import { fromStatus, canceledError } from './errors.js';

const KNOWN_OPTIONS = new Set([
  'params', 'headers', 'timeout', 'signal', 'responseType', 'encoding', 'cache',
]);

const DEFAULT_HEADERS = {
  accept: 'application/json, text/plain, */*',
  'user-agent': 'axios/1.8.3',
  'accept-encoding': 'gzip, deflate, br',
};

function validateOptions(opts, extraAllowed = []) {
  if (!opts) return;
  const allowed = new Set([...KNOWN_OPTIONS, ...extraAllowed]);
  const keys = Object.keys(opts);
  keys.forEach((k) => {
    if (!allowed.has(k)) {
      throw new TypeError(`Unknown option: ${k}`);
    }
  });
}

function mergeHeaders(defaults, custom) {
  if (!custom) return { ...defaults };
  const result = { ...defaults };
  const customKeys = Object.keys(custom);
  customKeys.forEach((k) => {
    result[k.toLowerCase()] = custom[k];
  });
  return result;
}

function buildHopReq(method, url, opts) {
  const { params, headers, timeout, signal, body } = opts;
  const finalUrl = buildUrl(url.trim(), params);
  const finalHeaders = mergeHeaders(DEFAULT_HEADERS, headers);
  return {
    method: method.toUpperCase(),
    url: finalUrl,
    headers: finalHeaders,
    body,
    timeout: timeout || 0,
    signal,
  };
}

async function execute(req, opts) {
  const { responseType, encoding, signal } = opts;

  if (signal && signal.aborted) {
    throw canceledError(req);
  }

  const deadline = createDeadline(req.timeout);

  const res = await follow(req, (hopReq, dl) => send(hopReq, dl), 0, deadline);

  if (res.status < 200 || res.status > 299) {
    throw fromStatus(req.method, req.url, res.status, res.statusText, res.headers, decodeBody(res.body, responseType, encoding));
  }

  const data = decodeBody(res.body, responseType, encoding);

  return {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    data,
    config: { url: req.url, method: req.method },
  };
}

/**
 * httpClient.get(url, opts?)
 * opts: { params?, headers?, timeout?, signal?, responseType?, encoding?, cache? }
 */
async function get(url, opts = {}) {
  validateOptions(opts);
  const req = buildHopReq('GET', url, opts);
  return execute(req, opts);
}

/**
 * httpClient.post(url, body, opts?)
 * opts: { params?, headers?, timeout?, signal?, responseType?, encoding? }
 */
async function post(url, body, opts = {}) {
  // post não aceita 'cache'
  validateOptions(opts, []);
  const headers = opts.headers ? { ...opts.headers } : {};
  const { encodedBody, headers: encodedHeaders } = encodeBody(body, {
    ...DEFAULT_HEADERS,
    ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])),
  });
  const req = buildHopReq('POST', url, { ...opts, headers: encodedHeaders, body: encodedBody });
  return execute(req, opts);
}

const httpClient = { get, post };

export default httpClient;
