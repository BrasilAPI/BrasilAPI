/*!
 * Refatoração feita a partir da biblioteca micro-cors
 * Copyright (c) MIT License - https://github.com/possibilities/micro-cors
 */

const DEFAULT_ALLOW_METHODS = [
  'POST',
  'GET',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
];

const DEFAULT_ALLOW_HEADERS = [
  'X-Requested-With',
  'Access-Control-Allow-Origin',
  'X-HTTP-Method-Override',
  'Content-Type',
  'Authorization',
  'Accept',
];

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export default function cors(options = {}) {
  return function (request) {
    const {
      origin = '*',
      maxAge = DEFAULT_MAX_AGE_SECONDS,
      allowMethods = DEFAULT_ALLOW_METHODS,
      allowHeaders = DEFAULT_ALLOW_HEADERS,
      allowCredentials = true,
      exposeHeaders = [],
    } = options;

    const headers = {};

    headers['Access-Control-Allow-Origin'] = origin;

    if (allowCredentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }

    if (exposeHeaders.length) {
      headers['Access-Control-Expose-Headers'] = exposeHeaders.join(',');
    }

    const preFlight = request.method === 'OPTIONS';

    if (preFlight) {
      headers['Access-Control-Allow-Methods'] = allowMethods.join(',');
      headers['Access-Control-Allow-Headers'] = allowHeaders.join(',');
      headers['Access-Control-Max-Age'] = String(maxAge);
    }

    return { headers };
  };
}
