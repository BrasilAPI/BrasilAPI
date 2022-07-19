const axios = require('axios');

describe('Códigos CNAE v1 (E2E)', () => {
  test('GET /cnae-code/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cnae/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
