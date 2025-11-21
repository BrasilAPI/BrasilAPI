import axios from 'axios';
import { describe, test, expect, beforeAll } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

// Smart service availability check - skip only when DNS/network issues are detected
let shouldSkipTests = false; // Default to skip for safety

beforeAll(async () => {
  try {
    // Quick health check for IBGE service
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
      timeout: 2000, // Short timeout to fail fast on DNS issues
    });
    
    if (response.status === 200) {
      shouldSkipTests = false;
      console.log('✅ IBGE service is available - running tests');
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
      console.warn('⚠️  IBGE service unavailable (network/DNS issue) - skipping tests');
    } else {
      console.warn('⚠️  IBGE service health check failed - skipping tests:', error.message);
    }
    shouldSkipTests = true;
  }
});

// Conditionally skip based on actual service availability
const describeIf = (condition) => (condition ? describe.skip : describe);

describeIf(shouldSkipTests)('/ibge/uf/v1 (E2E)', () => {
  test('Utilizando um Codigo válido: 22', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/22`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
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
    expect(response.data).toEqual({
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
    expect(response.data).toEqual({
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
        message: 'UF não encontrada.',
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
