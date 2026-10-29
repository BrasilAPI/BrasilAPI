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

describe.skipIf(shouldSkipTests)('weather prediction v1 (E2E)', () => {
  describe('Route WITHOUT number of days for prediction', () => {
    test('GET /api/cptec/v1/clima/previsao/:cityCode (Invalid City Code)', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/9999`;

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

    test('GET /api/cptec/v1/clima/previsao/:cityCode', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/999`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(false);

      expect(Array.isArray(response.data.clima)).toBe(true);
      expect(response.data.clima.length).toBe(1);
      expect(response.data).toMatchObject({
        cidade: 'Brejo Alegre',
        estado: 'SP',
      });
    });
  });

  describe('Route WITH number of days for query', () => {
    test('GET /api/cptec/v1/clima/previsao/:cityCode/:days', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/999/2`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(false);

      expect(Array.isArray(response.data.clima)).toBe(true);
      expect(response.data.clima.length).toBe(2);

      expect(response.data).toMatchObject({
        cidade: 'Brejo Alegre',
        estado: 'SP',
      });
    });

    test('GET /api/cptec/v1/clima/previsao/:cityCode/:days (Invalid number of days)', async () => {
      const requestUrl1 = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/999/15`;
      const requestUrl2 = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/999/0`;

      // More than 14 days
      await expect(axios.get(requestUrl1)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message:
              'Quantidade de dias inválida (mínimo 1 dia e máximo 14 dias)',
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
              'Quantidade de dias inválida (mínimo 1 dia e máximo 14 dias)',
            type: 'request_error',
            name: 'INVALID_NUMBER_OF_DAYS',
          },
        },
      });
    });

    test('GET /api/cptec/v1/clima/previsao/:cityCode/:days (Non-integer days: 2.5)', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/999/2.5`;

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

  describe('Route WITH lat long', () => {
    test('GET prevision of campina - sp', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/semana/-22.90/-47.06`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(false);

      expect(Array.isArray(response.data.clima)).toBe(true);
      expect(response.data.clima.length).toBeGreaterThan(2);
      expect(response.data.clima.length).toBeLessThanOrEqual(7);

      expect(response.data).toMatchObject({
        cidade: 'Campinas',
        estado: 'SP',
      });
    });

    test.skip('GET prevision of campina - sp with positive lat/long', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/semana/22.90/47.06`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(false);

      expect(Array.isArray(response.data.clima)).toBe(true);
      expect(response.data.clima.length).toBeGreaterThan(2);
      expect(response.data.clima.length).toBeLessThanOrEqual(7);

      expect(response.data).toMatchObject({
        cidade: 'Campinas',
        estado: 'SP',
      });
    });

    test('GET prevision of location not in Brazil', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/semana/1/1`;

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

    test('GET with invalid long', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/semana/-22.90/abc`;

      await expect(axios.get(requestUrl)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            name: 'INVALID_POSITION_LONG',
            type: 'request_error',
          },
        },
      });
    });

    test('GET with invalid lat', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/semana/abc/-47.06`;

      await expect(axios.get(requestUrl)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            name: 'INVALID_POSITION_LAT',
            type: 'request_error',
          },
        },
      });
    });
  });
});
