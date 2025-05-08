import axios from 'axios';
import { beforeAll, describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('api/cnpj/v1 (E2E)', () => {
  let requestUrl = '';

  beforeAll(async () => {
    requestUrl = `${global.SERVER_URL}/api/cnpj/v1`;
  });

  test('Verifica CORS', async () => {
    const response = await axios.get(`${requestUrl}/19131243000197`);

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('Utilizando um CNPJ válido existente: 19131243000197', async () => {
    const response = await axios.get(`${requestUrl}/19131243000197`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data.razao_social).toEqual('OPEN KNOWLEDGE BRASIL');
  });

  test('Utilizando um CNPJ válido inexistente: 00000000000000', async () => {
    try {
      await axios.get(`${requestUrl}/00000000000000`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual({
        message: 'CNPJ 00.000.000/0000-00 não encontrado.',
        name: 'NotFoundError',
        type: 'not_found',
      });
    }
  });

  test('Utilizando um CNPJ inválido: 123', async () => {
    try {
      await axios.get(`${requestUrl}/123`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual({
        message: 'CNPJ 123 inválido.',
        name: 'BadRequestError',
        type: 'bad_request',
      });
    }
  });
});

testCorsForRoute('/api/cnpj/v1/19131243000197');
