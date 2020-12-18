const axios = require('axios');

describe('Swell prediction v1 (E2E)', () => {
  describe('Route WITHOUT number of days for swell', () => {
    test('GET /api/cptec/v1/swell/:cityCode (Invalid City Code) ', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/swell/9999`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        console.log(error);
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Cidade não localizada',
          type: 'CITY_NOT_FOUND',
        });
      }
    });

    test('GET /api/cptec/v1/swell/:cityCode', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/swell/241`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(false);

      expect(response.data).toMatchObject({
        city_name: 'Rio de Janeiro',
        state: 'RJ'
      });

      expect(Array.isArray(response.data.swell)).toBe(true);
      expect(response.data.swell.length).toBe(1);
    });
  });

  describe('Route WITH number of days for query', () => {
    test('GET /api/cptec/v1/swell/:cityCode/:days', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/swell/241/2`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(false);


      expect(Array.isArray(response.data.swell)).toBe(true);
      expect(response.data.swell.length).toBe(2);
    });

    test('GET /api/cptec/v1/swell/:cityCode/days (Invalid number of days) ', async () => {
      const requestUrl1 = `${global.SERVER_URL}/api/cptec/v1/swell/241/7`;
      const requestUrl2 = `${global.SERVER_URL}/api/cptec/v1/swell/241/0`;

      // More than 6 days
      try {
        await axios.get(requestUrl1);
      } catch (error) {
        console.log(error);
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
          type: 'INVALID_NUMBER_OF_DAYS',
        });
      }

      // Less than 1 day
      try {
        await axios.get(requestUrl2);
      } catch (error) {
        console.log(error);
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
          type: 'INVALID_NUMBER_OF_DAYS',
        });
      }
    });
  });
});
