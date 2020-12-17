const axios = require('axios');

describe('weather capital v1 (E2E)', () => {
  

  test('GET /api/cptec/v1/weather/capital', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/weather/capital`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);

    expect(response.data[0]).toMatchObject({
      icao_code: 'SBAR'
    });
  });
});
