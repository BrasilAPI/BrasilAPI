import axios from 'axios';
import { describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

// Smart service availability check (CVM bloqueia os runners do GH Actions)
let shouldSkipTests = false;

try {
  const response = await axios.get('https://dados.cvm.gov.br/', {
    timeout: 5000,
  });
  if (response.status !== 200) {
    shouldSkipTests = true;
  }
} catch (error) {
  shouldSkipTests = true;
}

const validOutputSchema = expect.objectContaining({
  bairro: expect.any(String),
  cep: expect.any(String),
  cnpj: expect.any(String),
  codigo_cvm: expect.any(String),
  complemento: expect.any(String),
  data_inicio_situacao: expect.any(String),
  data_patrimonio_liquido: expect.any(String),
  data_registro: expect.any(String),
  email: expect.any(String),
  logradouro: expect.any(String),
  municipio: expect.any(String),
  nome_social: expect.any(String),
  nome_comercial: expect.any(String),
  pais: expect.any(String),
  telefone: expect.any(String),
  uf: expect.any(String),
  valor_patrimonio_liquido: expect.any(String),
});

const validTestTableArray = expect.arrayContaining([validOutputSchema]);

describe.skipIf(shouldSkipTests)('corretoras v1 (E2E)', () => {
  describe('GET /cvm/corretoras/v1/:cnpj', () => {
    test('Verifica CORS', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1/02332886000104`;
      const response = await axios.get(requestUrl);

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    test('Utilizando um CNPJ válido: 02332886000104', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1/02332886000104`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(validOutputSchema);

      expect(response.data.cnpj).toBe('02332886000104');
      expect(response.data.codigo_cvm).toBe('3247');
      expect(response.data.data_inicio_situacao).toBe('1998-02-10');
      expect(response.data.data_registro).toBe('1997-12-05');
      expect(response.data.nome_social).toContain('XP INVESTIMENTOS');
      expect(response.data.nome_comercial).toContain('XP INVESTIMENTOS');
      expect(response.data.type).toBe('CORRETORAS');
    });

    test('Utilizando um CNPJ inexistente: 1111111', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1/1111111`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Nenhuma corretora localizada',
          type: 'exchange_error',
          name: 'EXCHANGE_NOT_FOUND',
        });
      }
    });
  });

  test('GET /cvm/corretoras/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toEqual(validTestTableArray);
  });

  test('GET /cvm/corretoras/v1?uf=SP: filtra por estado (issue #736)', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1?uf=SP`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    const allSp = response.data.every(
      (corretora) => String(corretora.uf).toUpperCase() === 'SP'
    );
    expect(allSp).toBe(true);
  });

  test('GET /cvm/corretoras/v1?uf=XX: UF sem corretoras → 200 []', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1?uf=XX`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual([]);
  });

  test('GET /cvm/corretoras/v1?uf=invalida: UF inválida → 400', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${global.SERVER_URL}/api/cvm/corretoras/v1?uf=invalida`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data.type).toBe('validation_error');
    }
  });
});

// CORS tests - only run when the service is healthy
if (!shouldSkipTests) {
  testCorsForRoute('/api/cvm/corretoras/v1');
  testCorsForRoute('/api/cvm/corretoras/v1/02332886000104');
}
