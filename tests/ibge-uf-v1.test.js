import axios from 'axios';
import { describe, test, expect } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

// Smart service availability check (IBGE bloqueia os runners do GH Actions)
let shouldSkipTests = true;

try {
  const response = await axios.get(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
    { timeout: 5000 }
  );
  if (response.status === 200) {
    shouldSkipTests = false;
  }
} catch (error) {
  shouldSkipTests = true;
}

// Conditionally skip based on actual service availability
const describeIf = (condition) => (condition ? describe.skip : describe);

describeIf(shouldSkipTests)('/ibge/uf/v1 (E2E)', () => {
  test('Utilizando um Codigo válido: 22', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/22`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      id: 22,
      sigla: expect.any(String),
      nome: expect.any(String),
      regiao: expect.objectContaining({
        id: expect.any(Number),
        sigla: expect.any(String),
        nome: expect.any(String),
      }),
      capital: expect.any(String),
    });
  });

  test('Utilizando um Codigo inexistente ou inválido: 99', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/99`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
    }
  });

  test('Buscando todas as ufs', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          sigla: expect.any(String),
          nome: expect.any(String),
          regiao: expect.objectContaining({
            id: expect.any(Number),
            sigla: expect.any(String),
            nome: expect.any(String),
          }),
          capital: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando uma Sigla válida: sc', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/sc`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      id: 42,
      sigla: expect.any(String),
      nome: expect.any(String),
      regiao: expect.objectContaining({
        id: expect.any(Number),
        sigla: expect.any(String),
        nome: expect.any(String),
      }),
      capital: expect.any(String),
    });
    expect(response.data.capital).toBe('Florianópolis');
  });

  test('Utilizando uma Sigla válida: PI', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/PI`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      id: 22,
      sigla: expect.any(String),
      nome: expect.any(String),
      regiao: expect.objectContaining({
        id: expect.any(Number),
        sigla: expect.any(String),
        nome: expect.any(String),
      }),
      capital: expect.any(String),
    });
    expect(response.data.capital).toBe('Teresina');
  });

  test('Utilizando um sigla inexistente ou inválida: SJ', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/SJ`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'NotFoundError',
        type: 'not_found',
      });
    }
  });
});

// CORS tests - only run when IBGE service is healthy
if (!shouldSkipTests) {
  testCorsForRoute('/api/ibge/uf/v1');
  testCorsForRoute('/api/ibge/uf/v1/22');
  testCorsForRoute('/api/ibge/uf/v1/PI');
}
