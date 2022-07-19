const axios = require('axios');

describe('Lista natureza jurídica v1 (E2E)', () => {
  test('GET /legal-nature/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/legal-nature/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
