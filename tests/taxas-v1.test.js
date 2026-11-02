import axios from 'axios';
import { beforeAll, describe, expect, test } from 'vitest';

import * as selic from 'selic';

import { testCorsForRoute } from './helpers/cors';

// Smart service availability check: probes the same upstream providers the
// endpoints depend on (BCB for SELIC/IPCA and B3 for CDI), which are known to
// block or throttle GitHub Actions runners.
const HEALTH_CHECK_TIMEOUT_MS = 5000;

const withTimeout = (promise) =>
  Promise.race([
    promise,
    new Promise((_resolve, reject) => {
      setTimeout(
        () => reject(new Error('Health check timeout')),
        HEALTH_CHECK_TIMEOUT_MS
      );
    }),
  ]);

const healthChecks = await Promise.allSettled(
  [selic.getSelicRate, selic.getCdiRate, selic.getIpcaRate].map((fetchRate) =>
    withTimeout(fetchRate())
  )
);

const shouldSkipTests = healthChecks.some(
  ({ status }) => status === 'rejected'
);

describe.skipIf(shouldSkipTests)('api/taxas/v1 (E2E)', () => {
  let requestUrl = '';

  beforeAll(async () => {
    requestUrl = `${global.SERVER_URL}/api/taxas/v1`;
  });

  test('Recuperando a lista de taxas', async () => {
    const response = await axios.get(requestUrl);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
    data.forEach((taxa) => {
      expect(taxa).toHaveProperty('nome', expect.any(String));
      expect(taxa).toHaveProperty('valor', expect.any(Number));
    });
  });

  test('Buscando uma taxa válida: cdi', async () => {
    const response = await axios.get(`${requestUrl}/cdi`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(data).toHaveProperty('nome', 'CDI');
    expect(data).toHaveProperty('valor', expect.any(Number));
  });

  test('Buscando uma taxa válida: selic', async () => {
    const response = await axios.get(`${requestUrl}/selic`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(data).toHaveProperty('nome', 'SELIC');
    expect(data).toHaveProperty('valor', expect.any(Number));
  });

  test('Buscando uma taxa válida: ipca', async () => {
    const response = await axios.get(`${requestUrl}/ipca`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(data).toHaveProperty('nome', 'IPCA');
    expect(data).toHaveProperty('valor', expect.any(Number));
  });

  test('Buscando uma taxa inválida: xpto', async () => {
    await expect(axios.get(`${requestUrl}/xpto`)).rejects.toMatchObject({
      response: {
        status: 404,
        data: {
          message: 'Taxa ou Índice não encontrada.',
          name: 'NotFoundError',
          type: 'not_found',
        },
      },
    });
  });
});

// CORS tests - only run when the service is healthy
if (!shouldSkipTests) {
  testCorsForRoute('/api/taxas/v1');
  testCorsForRoute('/api/taxas/v1/cdi');
}
