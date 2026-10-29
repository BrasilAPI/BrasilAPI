import axios from 'axios';
import { describe, expect, test } from 'vitest';

// Smart service availability check - skip only when DNS/network issues are detected
let shouldSkipTests = false;

try {
  const response = await axios.get(
    'https://servicos.cptec.inpe.br/XML/listaCidades?city=brasilia',
    {
      timeout: 5000,
    }
  );

  if (response.status !== 200) {
    shouldSkipTests = true;
  }
} catch (error) {
  shouldSkipTests = true;
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  CPTEC service unavailable (network/DNS issue) - skipping tests'
  );
}

describe.skipIf(shouldSkipTests)('cities v1 (E2E)', () => {
  describe('GET /cptec/v1/cidade/:name', () => {
    test('Utilizando um nome de cidade existente: São Sebastião', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cidade/São Sebastião`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data[1]).toEqual({
        id: 5051,
        nome: 'São Sebastião',
        estado: 'SP',
        regiao: 'Sudeste',
      });
    });

    test('Utilizando um nome de cidade com retorno único: Belo Horizonte', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cidade/Belo Horizonte`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data[0]).toEqual({
        id: 222,
        nome: 'Belo Horizonte',
        estado: 'MG',
        regiao: 'Sudeste',
      });
    });

    test('Utilizando um nome de cidade inexistente: chiforímpola', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cidade/chiforímpola`;

      await expect(axios.get(requestUrl)).rejects.toMatchObject({
        response: {
          status: 404,
          data: {
            message: 'Nenhuma cidade localizada',
            type: 'city_error',
            name: 'NO_CITY_NOT_FOUND',
          },
        },
      });
    });
  });

  test('GET /cptec/v1/cidade', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cidade`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
