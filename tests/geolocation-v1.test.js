const axios = require('axios');

describe('/geolocation/v1 (E2E)', () => {
  test('it should be return the city and country if the coordinates exists', async () => {
    const requestUrl = `${global.SERVER_URL}/api/geolocation/v1?latitude=-22.871304&longitude=-47.2044911&language=pt`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      city: 'Região Metropolitana de Campinas',
      country: 'Brasil',
    });
  });

  test('it should be return an error if coordinates format is invalid', async () => {
    const requestUrl = `${global.SERVER_URL}/api/geolocation/v1?latitude=-0&longitude=0`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toBe({
        message: 'Geolocalização inválida',
        name: 'BadRequestError',
        type: 'bad_request',
      });
    }
  });
});
