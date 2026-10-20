import { createServer } from 'http';
import axios from 'axios';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import handler from '@/pages/api/cnpj/v1/[cnpj]';
import { getCnpjData } from '@/services/cnpj';

const unavailable = {
  message: 'Serviço de consulta de CNPJ temporariamente indisponível.',
  name: 'ServiceUnavailableError',
  type: 'service_unavailable',
};

function providerError(status, code) {
  return new axios.AxiosError(
    'Private provider error',
    code,
    { url: 'https://minhareceita.org/private' },
    {},
    status ? { status, data: { message: 'Mensagem do provedor.' } } : undefined
  );
}

let server;
let url;

beforeAll(async () => {
  // Use the real app/error/cache/CORS middleware, with only the provider mocked.
  server = createServer((request, response) => {
    request.query = { cnpj: '00000000000000' };
    response.status = (status) => {
      response.statusCode = status;
      return response;
    };
    response.json = (data) => {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(data));
      return response;
    };
    handler(request, response);
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  url = `http://127.0.0.1:${server.address().port}/api/cnpj/v1/00000000000000`;
});

afterAll(async () => {
  if (!server) return;
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
    server.closeAllConnections();
  });
});

beforeEach(() => {
  vi.spyOn(axios, 'get');
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('CNPJ provider failure contract', () => {
  test('preserves the successful status, payload, CORS and cache policy', async () => {
    const data = {
      cnpj: '00000000000000',
      razao_social: 'EMPRESA DE TESTE',
      capital_social: 0,
      qsa: [],
      porte: null,
    };
    axios.get.mockResolvedValue({ status: 200, data });

    const response = await fetch(url);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(data);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('cache-control')).toContain('s-maxage=86400');
    expect(axios.get).toHaveBeenCalledExactlyOnceWith(
      'https://minhareceita.org/00000000000000',
      { timeout: 5000, signal: expect.any(AbortSignal) }
    );
  });

  test('keeps CORS preflight independent of provider availability', async () => {
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://example.com',
        'Access-Control-Request-Method': 'GET',
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('keeps unexpected errors as 500 through the error middleware', async () => {
    axios.get.mockRejectedValue(new TypeError('Unexpected error'));

    const response = await fetch(url);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      message: 'Unexpected error',
      name: 'TypeError',
      type: 'internal_error',
    });
  });

  test.each([
    [400, 'BadRequestError', 'bad_request'],
    [404, 'NotFoundError', 'not_found'],
  ])('preserves provider %s responses', async (status, name, type) => {
    axios.get.mockRejectedValue(providerError(status));

    const response = await fetch(url);

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({
      message: 'Mensagem do provedor.',
      name,
      type,
    });
  });

  test.each([500, 502, 503, 504, 599])(
    'maps provider %s to a non-cacheable, sanitized 503',
    async (status) => {
      axios.get.mockRejectedValue(providerError(status));

      const response = await fetch(url);

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual(unavailable);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
      expect(axios.get).toHaveBeenCalledTimes(1);
    }
  );

  test.each(['ECONNABORTED', 'ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND'])(
    'maps transport failure %s to 503',
    async (code) => {
      axios.get.mockRejectedValue(providerError(undefined, code));

      const response = await fetch(url);

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual(unavailable);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
  );

  test.each([401, 403, 429, 600])(
    'does not reclassify other provider status %s as unavailable',
    async (status) => {
      const error = providerError(status);
      axios.get.mockRejectedValue(error);
      await expect(getCnpjData('00000000000000')).rejects.toBe(error);
    }
  );

  test.each([
    new TypeError('Unexpected error'),
    new axios.AxiosError('Invalid configuration', 'ERR_BAD_OPTION'),
  ])(
    'does not disguise programming/configuration errors: %s',
    async (error) => {
      axios.get.mockRejectedValue(error);
      await expect(getCnpjData('00000000000000')).rejects.toBe(error);
    }
  );

  test('aborts a stalled connection after 5 seconds and clears the deadline', async () => {
    vi.useFakeTimers();
    axios.get.mockImplementation(
      (providerUrl, { signal }) =>
        new Promise((resolve, reject) => {
          signal.addEventListener('abort', () => {
            reject(new axios.CanceledError('canceled'));
          });
        })
    );
    const request = getCnpjData('00000000000000').catch((error) => error);
    const { signal } = axios.get.mock.calls[0][1];

    await vi.advanceTimersByTimeAsync(4999);
    expect(signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await expect(request).resolves.toMatchObject({
      status: 503,
      ...unavailable,
    });
    expect(signal.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  test.each([true, false])(
    'clears the deadline on settled requests: %s',
    async (success) => {
      vi.useFakeTimers();
      if (success) axios.get.mockResolvedValue({ status: 200, data: {} });
      else axios.get.mockRejectedValue(providerError(404));

      await getCnpjData('00000000000000').catch(() => {});

      expect(vi.getTimerCount()).toBe(0);
      expect(axios.get.mock.calls[0][1].signal.aborted).toBe(false);
    }
  );
});
