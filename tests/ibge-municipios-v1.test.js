import axios from 'axios';
import { describe, test, expect } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

const validTestArray = expect.arrayContaining([
  expect.objectContaining({
    nome: expect.any(String),
    codigo_ibge: expect.any(String),
  }),
]);

// TODO: This test is intermitent at Github Actions provider
describe.skip('/ibge/municipios/v1 (E2E)', () => {
  test('Utilizando uma sigla válida: SC', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/SC`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });

  test('Utilizando uma sigla válida: RS', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/RS`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });

  test('Utilizando provider gov:', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/RS?providers=gov`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });

  test('Utilizando provider dados-abertos-br:', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/RS?providers=dados-abertos-br`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });

  test('Utilizando provider wikipedia:', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/RS?providers=wikipedia`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });

  test('Utilizando uma sigla inexistente (formato válido): AA', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/AA`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'EstadoNotFoundException',
        message: 'UF não encontrada.',
        type: 'not_found',
      });
    }
  });

  test('Sigla mal formatada: 400', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/SP1`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({
        name: 'UfBadRequestException',
        type: 'bad_request',
      });
    }
  });

  test('Provider inválido na query: 422', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/RS?providers=gov,foo`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(422);
      expect(response.data).toMatchObject({
        name: 'ProvidersInvalidException',
        type: 'unprocessable_entity',
      });
      expect(response.data.errors).toEqual(['foo']);
    }
  });
});

testCorsForRoute('/api/ibge/municipios/v1/SC');
