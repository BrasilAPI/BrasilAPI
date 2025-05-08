import axios from 'axios';
import { beforeAll, describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('api/taxas/v1 (E2E)', () => {
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

testCorsForRoute('/api/taxas/v1');
testCorsForRoute('/api/taxas/v1/cdi');
