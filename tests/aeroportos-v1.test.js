const axios = require('axios');

describe('banks v1 (E2E)', () => {
  test('GET /aeroportos/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/aeroportos/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
