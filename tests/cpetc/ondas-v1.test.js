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

describe.skipIf(shouldSkipTests)('ondas prediction v1 (E2E)', () => {
  describe('Route WITHOUT number of days for ondas', () => {
    test('GET /api/cptec/v1/ondas/:cityCode (Invalid City Code)', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/ondas/9999`;

      await expect(axios.get(requestUrl)).rejects.toMatchObject({
        response: {
          status: 404,
          data: {
            message: 'Cidade não localizada',
            type: 'city_error',
            name: 'CITY_NOT_FOUND',
          },
        },
      });
    });

    test('GET /api/cptec/v1/ondas/:cityCode', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/ondas/241`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(false);

      expect(response.data).toMatchObject({
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
      });

      expect(Array.isArray(response.data.ondas)).toBe(true);
      expect(response.data.ondas.length).toBe(1);
    });
  });

  describe('Route WITH number of days for query', () => {
    test('GET /api/cptec/v1/ondas/:cityCode/:days', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/ondas/241/2`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(false);

      expect(Array.isArray(response.data.ondas)).toBe(true);
      expect(response.data.ondas.length).toBe(2);
      expect(response.data).toMatchObject({
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
      });
    });

    test('GET /api/cptec/v1/ondas/:cityCode/days (Invalid number of days)', async () => {
      const requestUrl1 = `${global.SERVER_URL}/api/cptec/v1/ondas/241/7`;
      const requestUrl2 = `${global.SERVER_URL}/api/cptec/v1/ondas/241/0`;

      // More than 6 days
      await expect(axios.get(requestUrl1)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message:
              'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
            type: 'request_error',
            name: 'INVALID_NUMBER_OF_DAYS',
          },
        },
      });

      // Less than 1 day
      await expect(axios.get(requestUrl2)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message:
              'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
            type: 'request_error',
            name: 'INVALID_NUMBER_OF_DAYS',
          },
        },
      });
    });

    test('GET /api/cptec/v1/ondas/:cityCode/:days (Non-integer days: 1.5)', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/ondas/241/1.5`;

      await expect(axios.get(requestUrl)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Quantidade de dias inválida, informe um valor inteiro',
            type: 'request_error',
            name: 'INVALID_NUMBER_OF_DAYS',
          },
        },
      });
    });
  });
});
