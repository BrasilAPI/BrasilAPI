const axios = require('axios');
const crypto = require('crypto');

describe('/feriados/v1/{ano}/{uf} (E2E)', () => {
  test('Requisição com ano e uf válidos', async () => {
    const year = 1900 + crypto.randomInt(2199 - 1900);
    const uf = 'sp';
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/${year}/${uf}`;
    const { status } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(status).toEqual(200);
  });

  test('Requisição com ano válido e uf inválida', async () => {
    const year = 1900 + crypto.randomInt(2199 - 1900);
    const uf = 'uf_invalida';
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/${year}/${uf}`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      expect.assertions(1);
      expect(error.response.status).toEqual(400);
    }
  });

  test('Requisição com ano inválido', async () => {
    const year = 1000;
    const uf = 'ma';
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/${year}/${uf}`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      expect.assertions(1);
      expect(error.response.status).toEqual(404);
    }
  });
});
