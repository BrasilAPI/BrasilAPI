/**
 * lib/http/redirects.js
 * Seguidor de redirects recursivo — regras do follow-redirects 1.15.11.
 * Máximo: 21 saltos. Sem await em laço (no-await-in-loop), recursão pura.
 */

import { createDeadline } from './transport.js';
import { canceledError } from './errors.js';

const MAX_REDIRECTS = 21;

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

// Cabeçalhos removidos em mudança de host
const SENSITIVE_HEADERS = ['authorization', 'cookie', 'cookie2'];

// Cabeçalhos de conteúdo removidos em redirect POST→GET
const CONTENT_HEADERS = /^content-/i;

function shouldFollow(status) {
  return REDIRECT_STATUSES.has(status);
}

function isSameAuthority(from, to) {
  try {
    const a = new URL(from);
    const b = new URL(to);
    return a.hostname === b.hostname && a.port === b.port && a.protocol === b.protocol;
  } catch {
    return false;
  }
}

/**
 * Resolve o cabeçalho Location relativo/absoluto.
 * Lança ERR_FR_REDIRECTION_FAILURE se inválido ou protocolo não-http/https.
 */
function resolveLocation(baseUrl, location) {
  if (!location) {
    const err = new Error('No location header received for redirect');
    err.code = 'ERR_FR_REDIRECTION_FAILURE';
    throw err;
  }
  let resolved;
  try {
    resolved = new URL(location, baseUrl).href;
  } catch {
    const err = new Error(`Invalid redirect location: ${location}`);
    err.code = 'ERR_FR_REDIRECTION_FAILURE';
    throw err;
  }
  const protocol = new URL(resolved).protocol;
  if (protocol !== 'http:' && protocol !== 'https:') {
    const err = new Error(`Unsupported redirect protocol: ${protocol}`);
    err.code = 'ERR_FR_REDIRECTION_FAILURE';
    throw err;
  }
  return resolved;
}

/**
 * Agrupa cacheStatus: prioridade MISS > REVALIDATED > HIT.
 */
function aggregateCacheStatus(prev, next) {
  if (!prev && !next) return undefined;
  if (prev === 'MISS' || next === 'MISS') return 'MISS';
  if (prev === 'REVALIDATED' || next === 'REVALIDATED') return 'REVALIDATED';
  return 'HIT';
}

/**
 * Calcula o método e corpo do próximo salto de acordo com o status.
 * 301/302 POST→GET: descarta corpo, remove content-*
 * 303 não-GET→GET: idem
 * 307/308: mantém método e corpo
 */
function nextHopProps(req, status) {
  const method = req.method.toUpperCase();
  if (status === 307 || status === 308) {
    return { method, body: req.body };
  }
  if (status === 303 || ((status === 301 || status === 302) && method === 'POST')) {
    return { method: 'GET', body: undefined };
  }
  return { method, body: req.body };
}

/**
 * Constrói os cabeçalhos do próximo salto.
 * Remove: host (será definido pela URL); auth/cookie em mudança de host/protocolo;
 * content-* quando o método muda para GET.
 */
function nextHopHeaders(req, nextUrl, nextMethod) {
  const prevHeaders = { ...req.headers };
  const sameAuth = isSameAuthority(req.url, nextUrl);

  const result = {};
  const headerKeys = Object.keys(prevHeaders);
  headerKeys.forEach((k) => {
    const lower = k.toLowerCase();
    if (lower === 'host') return; // sempre removido
    if (!sameAuth && SENSITIVE_HEADERS.includes(lower)) return; // remove em troca de host
    if (nextMethod === 'GET' && CONTENT_HEADERS.test(lower)) return; // remove content-* em POST→GET
    result[k] = prevHeaders[k];
  });
  return result;
}

/**
 * follow — seguidor recursivo de redirects.
 * req: { method, url, headers, body?, timeout, signal?, ... }
 * hop: (hopReq, deadline) => Promise<{ status, statusText, headers, body, url, cacheStatus? }>
 */
export async function follow(req, hop, redirects = 0, deadline = createDeadline(req.timeout)) {
  // Verifica abort antes de qualquer ação
  if (req.signal && req.signal.aborted) {
    throw canceledError(req);
  }

  const res = await hop(req, deadline);

  if (!shouldFollow(res.status)) {
    return { ...res, cacheStatus: aggregateCacheStatus(res.cacheStatus, undefined) };
  }

  if (redirects >= MAX_REDIRECTS) {
    const err = new Error('Maximum number of redirects exceeded');
    err.code = 'ERR_FR_TOO_MANY_REDIRECTS';
    throw err;
  }

  const location = resolveLocation(req.url, res.headers && res.headers.location);
  const { method, body } = nextHopProps(req, res.status);
  const headers = nextHopHeaders({ ...req, method }, location, method);

  const nextReq = {
    ...req,
    method,
    url: location,
    headers,
    body,
  };

  const nextRes = await follow(nextReq, hop, redirects + 1, deadline);
  return {
    ...nextRes,
    cacheStatus: aggregateCacheStatus(res.cacheStatus, nextRes.cacheStatus),
  };
}
