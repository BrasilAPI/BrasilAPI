import axios from 'axios';
import { describe, expect, test } from 'vitest';
import { testCorsForRoute } from './helpers/cors';

describe('/cep/v1 (E2E)', () => {
  test('Bloqueio por user-agent e IP', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;

    await expect(
      axios.get(requestUrl, {
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'user-agent': 'Go-http-client/2.0',
        },
      })
    ).rejects.toMatchObject({
      response: {
        status: 429,
        data: expect.stringContaining('please stop abusing our public API'),
      },
    });
  });

  test('possui blockedIp mas não blocked user-agent', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;

    const response = await axios.get(requestUrl, {
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: expect.any(String),
    });
  });

  test('possui blocked user-agent mas não blocked IP', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;

    const response = await axios.get(requestUrl, {
      headers: {
        'user-agent': 'Go-http-client/2.0',
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: expect.any(String),
    });
  });

  test('Bloqueio por user-agent e pathToBlock', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/52010000`;

    await expect(
      axios.get(requestUrl, {
        headers: { 'user-agent': 'Go-http-client/2.0' },
      })
    ).rejects.toMatchObject({
      response: {
        status: 429,
        data: expect.stringContaining('please stop abusing our public API'),
      },
    });
  });

  test('não possui blocked user agent mas tem pathToBlock', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/52010000`;

    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      cep: '52010000',
      city: 'Recife',
      neighborhood: 'Paissandu',
      service: 'open-cep',
      state: 'PE',
      street: 'Rua do Paissandú',
    });
  });

  test('Verifica CORS', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('Utilizando um CEP válido: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: expect.any(String),
    });
  });

  test('Verifica fonte da informação: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: 'open-cep',
    });
  });

  test('Utilizando um CEP inexistente: 00000000', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/00000000`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'CepPromiseError',
        message: 'Todos os serviços de CEP retornaram erro.',
        type: 'service_error',
      });
    }
  });

  test('Utilizando um CEP inválido: 999999999999999', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/999999999999999`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'CepPromiseError',
        message: 'CEP deve conter exatamente 8 caracteres.',
        type: 'validation_error',
        errors: [
          {
            message: 'CEP informado possui mais do que 8 caracteres.',
            service: 'cep_validation',
          },
        ],
      });
    }
  });
});

testCorsForRoute('/api/cep/v1/05010000');
