/**
 * lib/http/codec.js
 * Utilitários de serialização/deserialização — sem imports externos.
 * Replica o comportamento do axios: buildURL, encodeBody, decodeBody.
 */

/**
 * buildUrl — replica axios helpers/buildURL.js
 * - null/undefined descartados
 * - Array → k[]=v (um par por item)
 * - Date → ISO string
 * - Espaço → '+', restaura :$,[],@
 * - Parâmetros boolean/number são convertidos via toString
 */
export function buildUrl(url, params) {
  if (!params) return url;

  const parts = [];
  const encode = (val) =>
    encodeURIComponent(String(val))
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%20/g, '+')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']');

  const keys = Object.keys(params);
  keys.forEach((key) => {
    const val = params[key];
    if (val === null || val === undefined) return;

    let values;
    if (Array.isArray(val)) {
      values = val.map((v) => ({ k: `${key}[]`, v }));
    } else if (val instanceof Date) {
      values = [{ k: key, v: val.toISOString() }];
    } else if (typeof val === 'object') {
      values = [{ k: key, v: JSON.stringify(val) }];
    } else {
      values = [{ k: key, v: val }];
    }

    values.forEach(({ k, v }) => {
      if (v === null || v === undefined) return;
      parts.push(`${encode(k)}=${encode(v)}`);
    });
  });

  if (parts.length === 0) return url;

  const serialized = parts.join('&');
  const hashIndex = url.indexOf('#');
  let baseUrl = hashIndex !== -1 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex !== -1 ? url.slice(hashIndex) : '';

  baseUrl += (baseUrl.includes('?') ? '&' : '?') + serialized;
  return baseUrl + hash;
}

/**
 * encodeBody — serializa o corpo da requisição para envio.
 * - URLSearchParams → url-encoded (content-type: application/x-www-form-urlencoded)
 * - Objeto simples com json content-type → JSON.stringify
 * - string/Buffer → passthrough
 */
export function encodeBody(body, headers) {
  if (body === undefined || body === null) return { encodedBody: undefined, headers };

  const mutHeaders = { ...headers };

  if (body instanceof URLSearchParams) {
    mutHeaders['content-type'] = 'application/x-www-form-urlencoded';
    return { encodedBody: body.toString(), headers: mutHeaders };
  }

  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    return { encodedBody: body, headers: mutHeaders };
  }

  if (typeof body === 'object') {
    if (!mutHeaders['content-type']) {
      mutHeaders['content-type'] = 'application/json';
    }
    return { encodedBody: JSON.stringify(body), headers: mutHeaders };
  }

  return { encodedBody: String(body), headers: mutHeaders };
}

/**
 * decodeBody — decodifica o Buffer de resposta.
 * - 'buffer' → Buffer
 * - 'text' → string com remoção de BOM (UTF-8)
 * - padrão → JSON.parse silencioso (falha → string)
 */
export function decodeBody(buffer, responseType, encoding) {
  if (!buffer || buffer.length === 0) {
    if (responseType === 'buffer') return Buffer.alloc(0);
    if (responseType === 'text') return '';
    return '';
  }

  if (responseType === 'buffer') return buffer;

  if (responseType === 'text') {
    const enc = encoding || 'utf8';
    let str = buffer.toString(enc);
    // Remove BOM UTF-8
    if (!encoding || encoding === 'utf8') {
      str = str.replace(/^\uFEFF/, '');
    }
    return str;
  }

  // default: JSON
  let str = buffer.toString('utf8').replace(/^\uFEFF/, '');
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
