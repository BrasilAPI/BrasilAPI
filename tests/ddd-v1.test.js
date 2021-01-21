const axios = require('axios');

const { validResponse, invalidResponse } = require('./helpers/ddd');

const requestUrl = `${global.SERVER_URL}/api/ddd/v1`;

describe('api/ddd/v1 (E2E)', () => {
  test('Utilizando um DDD válido: 11', async () => {
    const response = await axios.get(`${requestUrl}/11`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(validResponse);
  });

  test('Utilizando um DDD inexistente: 01', async () => {
    try {
      await axios.get(`${requestUrl}/01`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual(invalidResponse);
    }
  });
});
