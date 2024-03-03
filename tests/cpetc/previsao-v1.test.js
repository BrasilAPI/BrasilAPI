const axios = require('axios');

describe('weather prediction v1 (E2E)', () => {
  describe('Route WITHOUT number of days for prediction', () => {
    test('GET /api/cptec/v1/clima/previsao/:cityCode (Invalid City Code) ', async () => {
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

    test('GET /api/cptec/v1/clima/previsao/:cityCode/:days (Invalid number of days) ', async () => {
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
    // TODO: verify response to positive lat/long
    /*test('GET prevision of campina - sp with positive lat/long', async () => {
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
    });*/
    test('GET prevision of location not in Brazil', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/semana/1/1`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(500);

        expect(response.data).toMatchObject({
          name: 'CITY_WEATHER_PREDICTIONS_ERROR',
          type: 'weather_error',
        });
      }
    });

    test('GET with invalid long', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/semana/-22.90/abc`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          name: 'INVALID_POSITION_LONG',
          type: 'request_error',
        });
      }
    });
    test('GET with invalid lat', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/previsao/semana/abc/-47.06`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          name: 'INVALID_POSITION_LAT',
          type: 'request_error',
        });
      }
    });
  });
});
