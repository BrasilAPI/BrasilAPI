const axios = require('axios');

const createServer = require('./helpers/server.js');
const server = createServer();

const scenarioHoliday = {
  sucess: require('./helpers/scenarios/holiday/success.json'),
};

const requestUrl = `${server.getUrl()}/api/holiday/v1`;

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe('api/holiday/v1 (E2E)', () => {
  test('Utilizando o ano de 2020', async () => {
    const response = await axios.get(`${requestUrl}/2020`);
    expect(response.data).toEqual(scenarioHoliday.sucess);
  });

  test('Utilizando o ano "abc"', async () => {
    const response = await axios.get(`${requestUrl}/abc`);
    expect(response.data).toStrictEqual([]);
  });
});
