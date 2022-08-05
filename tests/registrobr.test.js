const axios = require('axios');

const URL = `${global.SERVER_URL}/api/registrobr/v1`;

describe('api/registrobr/v1 (E2E)', () => {
  test('Pesquisando um dominio registrado', async () => {
    const response = await axios.get(`${URL}/google`);
    expect(response.status).toBe(200);
    expect(response.data.status_code).toBe(2);
    expect(response.data.status).toBe('REGISTERED');
  });
  test('Pesquisando um dominio disponível', async () => {
    const response = await axios.get(`${URL}/q1w2e3r4t5y6u7i9p0-e3w2q1.ong.br`);
    expect(response.status).toBe(200);
    expect(response.data.status_code).toBe(0);
    expect(response.data.status).toBe('AVAILABLE');
  });
  test('Pesquisando domínios inválidos', async () => {
    try {
      throw new Error(await axios.get(`${URL}/Ç{á}$`));
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.type).toBe('bad_request');
    }
  });
});
