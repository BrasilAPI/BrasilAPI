import axios from 'axios';
import { beforeAll, describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

async function getRates(url) {
  const response = await axios.get(url, { validateStatus: () => true });
  expect(response.status, `${url} returned HTTP ${response.status}`).toBe(200);
  return response;
}

// Keep these live checks visible: an SGS probe cannot establish the health of
// the BCB website and B3 sources used by selic. Provider failures must fail E2E,
// while taxas-contract.test.js covers the routes without external requests.
describe('api/taxas/v1 (E2E)', () => {
  let requestUrl = '';

  beforeAll(async () => {
    requestUrl = `${global.SERVER_URL}/api/taxas/v1`;
  });

  test('Recuperando a lista de taxas', async () => {
    const response = await getRates(requestUrl);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
    data.forEach((taxa) => {
      expect(taxa).toHaveProperty('nome', expect.any(String));
      expect(taxa).toHaveProperty('valor', expect.any(Number));
    });
  });

  test('Buscando uma taxa válida: cdi', async () => {
    const response = await getRates(`${requestUrl}/cdi`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(data).toHaveProperty('nome', 'CDI');
    expect(data).toHaveProperty('valor', expect.any(Number));
  });

  test('Buscando uma taxa válida: selic', async () => {
    const response = await getRates(`${requestUrl}/selic`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(data).toHaveProperty('nome', 'SELIC');
    expect(data).toHaveProperty('valor', expect.any(Number));
  });

  test('Buscando uma taxa válida: ipca', async () => {
    const response = await getRates(`${requestUrl}/ipca`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(data).toHaveProperty('nome', 'IPCA');
    expect(data).toHaveProperty('valor', expect.any(Number));
  });

  test('Buscando uma taxa inválida: xpto', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${requestUrl}/xpto`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual({
        message: 'Taxa ou Índice não encontrada.',
        name: 'NotFoundError',
        type: 'not_found',
      });
    }
  });
});

// Preflight requests do not fetch provider data and must always run.
testCorsForRoute('/api/taxas/v1');
testCorsForRoute('/api/taxas/v1/cdi');
