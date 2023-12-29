const axios = require('axios');

const {
  validResponseDDDByStateV1,
  invalidResponseByState,
} = require('./helpers/ddd');

const requestUrl = `${global.SERVER_URL}/api/ddd/uf/v1`;

describe('api/ddd/uf/v1 (E2E)', () => {
  test('Utilizando um estado válido: MT', async () => {
    const response = await axios.get(`${requestUrl}/MT`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(validResponseDDDByStateV1);
  });

  test('Utilizando um estado inexistente: MTT', async () => {
    try {
      await axios.get(`${requestUrl}/MTT`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual(invalidResponseByState);
    }
  });
});
