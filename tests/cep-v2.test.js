import axios from 'axios';
import { describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('/cep/v2 (E2E)', () => {
  test('Verifica CORS', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('Utilizando um CEP válido: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: expect.any(String),
      location: {
        type: 'Point',
        coordinates: {
          longitude: expect.stringMatching(/^[-+]?\d+(\.\d+)?$/),
          latitude: expect.stringMatching(/^[-+]?\d+(\.\d+)?$/),
        },
      },
    });
  });

  test('Verifica fonte da informação: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: 'open-cep',
      location: {
        type: 'Point',
        coordinates: {
          longitude: expect.stringMatching(/^[-+]?\d+(\.\d+)?$/),
          latitude: expect.stringMatching(/^[-+]?\d+(\.\d+)?$/),
        },
      },
    });
  });

  test('Utilizando um CEP inexistente: 00000000', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/00000000`;

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
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/999999999999999`;

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

  test('Deve retornar as coordenadas -22.883892 e -43.3061123', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/20751120`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '20751120',
      state: 'RJ',
      city: 'Rio de Janeiro',
      neighborhood: 'Piedade',
      street: 'Rua Marcolino',
      service: expect.any(String),
      location: {
        type: 'Point',
        coordinates: {
          longitude: expect.stringMatching(/^[-+]?\d+(\.\d+)?$/),
          latitude: expect.stringMatching(/^[-+]?\d+(\.\d+)?$/),
        },
      },
    });
  });

  test('Uma cidade com CEP único, exemplo: 87360000, deve retornar as coordenadas -24.1851885 e -53.0250623', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/87360000`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '87360000',
      state: 'PR',
      city: 'Goioerê',
      neighborhood: null,
      street: null,
      service: expect.any(String),
      location: {
        type: 'Point',
        coordinates: {
          longitude: expect.stringMatching(/^[-+]?\d+(\.\d+)?$/),
          latitude: expect.stringMatching(/^[-+]?\d+(\.\d+)?$/),
        },
      },
    });
  });
});

testCorsForRoute('/api/cep/v2/14096180');
