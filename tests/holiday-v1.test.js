const axios = require('axios');

const createServer = require('./helpers/server.js');

const server = createServer();

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

const scenariosHoliday = {
  success: require('./helpers/scenarios/holiday/success'),
  incorrect: require('./helpers/scenarios/holiday/incorrect'),
};

describe('api/holiday/2020 (E2E)', () => {
  test('Utilizando um ano válido: 2020', async () => {
    const requestUrl = `${server.getUrl()}/api/holiday/v1/2020`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual(scenariosHoliday.success);
  });

  test('Utilizando um ano inválido: 1900', async () => {
    expect.assertions(2);
    const requestUrl = `${server.getUrl()}/api/holiday/v1/1900`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(500);
      expect(response.data).toMatchObject(scenariosHoliday.incorrect);
    }
  });
});
