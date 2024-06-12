const axios = require('axios');

const {
  validResponseV1,
  validResponseAllDDDV1,
  invalidResponse,
} = require('./helpers/ddd');

const requestUrl = `${global.SERVER_URL}/api/ddd/v1`;

describe('api/ddd/v1 (E2E)', () => {
  test('Obtendo todos os DDD válidos', async () => {
    const response = await axios.get(`${requestUrl}`);
    const { data, status } = response;

    expect(status).toEqual(200);
    const dddSP = data.filter((ddd) => ddd.state === 'SP');
    expect(dddSP).toEqual(validResponseAllDDDV1);
  });

  test('Utilizando um DDD válido: 11', async () => {
    const response = await axios.get(`${requestUrl}/11`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(validResponseV1);
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
