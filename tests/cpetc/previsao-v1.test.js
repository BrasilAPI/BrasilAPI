import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('weather prediction v1 (E2E)', () => {
  describe('Route WITHOUT number of days for prediction', () => {
    test('GET /api/cptec/v1/clima/previsao/:cityCode (Invalid City Code)', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/9999`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Cidade não localizada',
          type: 'city_error',
          name: 'CITY_NOT_FOUND',
        });
      }
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
      try {
        await axios.get(requestUrl1);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message:
            'Quantidade de dias inválida (mínimo 1 dia e máximo 14 dias)',
          type: 'request_error',
          name: 'INVALID_NUMBER_OF_DAYS',
        });
      }

      // Less than 1 day
      try {
        await axios.get(requestUrl2);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message:
            'Quantidade de dias inválida (mínimo 1 dia e máximo 14 dias)',
          type: 'request_error',
          name: 'INVALID_NUMBER_OF_DAYS',
        });
      }
    });
  });
});
