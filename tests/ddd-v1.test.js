const axios = require('axios');

const {
  validResponse,
  invalidResponseInvalid,
  invalidResponseNotFound,
} = require('./helpers/ddd');
const { testCorsForRoute } = require('./helpers/cors');

const requestUrl = `${global.SERVER_URL}/api/ddd/v1`;

describe('api/ddd/v1 (E2E)', () => {
  test('Utilizando um DDD válido: 11', async () => {
    const response = await axios.get(`${requestUrl}/11`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(validResponse);
  });

  test('Utilizando um DDD válido: 011', async () => {
    const response = await axios.get(`${requestUrl}/011`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(validResponse);
  });

  test('Utilizando um DDD inválido: 111', async () => {
    try {
      await axios.get(`${requestUrl}/111`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual(invalidResponseInvalid);
    }
  });

  test('Utilizando um DDD inválido: 1', async () => {
    try {
      await axios.get(`${requestUrl}/1`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual(invalidResponseInvalid);
    }
  });

  test('Utilizando um DDD inexistente: 01', async () => {
    try {
      await axios.get(`${requestUrl}/01`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual(invalidResponseNotFound);
    }
  });
});

testCorsForRoute('/api/ddd/v1/11');
