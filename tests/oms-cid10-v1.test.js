import axios from 'axios';
import { describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('oms cid10 v1 (E2E)', () => {
  describe('GET /oms/cid10/v1', () => {
    test('Deve retornar a lista completa de CID-10', async () => {
      const requestUrl = `${global.SERVER_URL}/api/oms/cid10/v1`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      response.data.forEach((cid10) => {
        expect(cid10).toEqual({
          codigo: expect.any(String),
          nome: expect.any(String),
        });
      });
    });
  });

  describe('GET /oms/cid10/v1/:code', () => {
    test('Utilizando um código válido: A00', async () => {
      const requestUrl = `${global.SERVER_URL}/api/oms/cid10/v1/A00`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ codigo: 'A00', nome: 'Cólera' });
    });

    test('Utilizando um subcódigo válido: A00.0', async () => {
      const requestUrl = `${global.SERVER_URL}/api/oms/cid10/v1/A00.0`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        codigo: 'A00.0',
        nome: 'Cólera Devida a Vibrio Cholerae 01, Biótipo Cholerae',
      });
    });

    test('Utilizando um código inexistente: ZZZ99', async () => {
      const requestUrl = `${global.SERVER_URL}/api/oms/cid10/v1/ZZZ99`;

      await expect(axios.get(requestUrl)).rejects.toMatchObject({
        response: {
          status: 404,
          data: {
            message: 'CID10 não encontrado',
            type: 'not_found',
          },
        },
      });
    });

    test('A busca diferencia maiúsculas de minúsculas: a00', async () => {
      const requestUrl = `${global.SERVER_URL}/api/oms/cid10/v1/a00`;

      await expect(axios.get(requestUrl)).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });
});

testCorsForRoute('/api/oms/cid10/v1');
testCorsForRoute('/api/oms/cid10/v1/A00');
