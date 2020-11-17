const axios = require('axios');

const createServer = require('./helpers/server.js');

const server = createServer();

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe('/geolocation/v1 (E2E)', () => {
  test('it should be return the city and country if the coordinates exists', async () => {
    const requestUrl = `${server.getUrl()}/api/geolocation/v1?latitude=-22.871304&longitude=-47.2044911&language=pt`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      city: 'Hortolândia',
      country: 'Brasil',
    });
  });

  test('it should be return an error if coordinates format is invalid', async () => {
    const requestUrl = `${server.getUrl()}/api/geolocation/v1?latitude=-0&longitude=0`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toBe({
        error: 'Invalid gelocation',
        message: 'an invalid geolocation was reported',
      });
    }
  });
});
