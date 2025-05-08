import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('ondas prediction v1 (E2E)', () => {
  describe('Route WITHOUT number of days for ondas', () => {
    test('GET /api/cptec/v1/ondas/:cityCode (Invalid City Code)', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/ondas/9999`;

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
      try {
        await axios.get(requestUrl1);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
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
          message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
          type: 'request_error',
          name: 'INVALID_NUMBER_OF_DAYS',
        });
      }
    });
  });
});
