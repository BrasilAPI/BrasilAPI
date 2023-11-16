const axios = require('axios');

describe('cambio v1 (E2E)', () => {
  test('GET /cambio/v1/moedas', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cambio/v1/moedas`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('Buscando boletim por moeda e data', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cambio/v1/boletim?moeda=USD&dataCotacao=11-14-2023`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('Buscando cotação por data', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao?dataCotacao=11-14-2023`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
