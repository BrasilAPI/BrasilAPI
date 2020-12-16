const axios = require('axios');

describe('weather airport v1 (E2E)', () => {

  test('GET /cptec/v1/weather/airport/:icaoCode (Código inexistente) ', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/weather/airport/AAAA`;
    const response = await axios.get(requestUrl);

    try {
      await axios.get(requestUrl);
    } catch (error) {
      console.log(error);
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        message: 'Condições meteorológicas ou aeroporto não localizados',
        type: 'AIRPORT_CONDITIONS_NOT_FOUND',
      });
    }
  });

  test('GET /cptec/v1/weather/:icaoCode', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/weather/airport/SBSP`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(false);

    expect(response.data).toMatchObject({
      icao_code: 'SBSP'
    });
  });
});
