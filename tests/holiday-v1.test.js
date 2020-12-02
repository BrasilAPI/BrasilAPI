const axios = require('axios');

const createServer = require('./helpers/server.js');

const server = createServer();

const scenarioHoliday = {
  sucess: {
    date: '2020-01-01',
    description: 'Confraternização Universal',
    holiday: true,
    limited_financial_operation: true,
  },
};

const requestUrl = `${server.getUrl()}/api/holiday/v1`;

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe('api/holiday/v1 (E2E)', () => {
  test('Utilizando a data de 2020-01-01', async () => {
    const response = await axios.get(`${requestUrl}/2020-01-01`);

    expect(response.data).toEqual(scenarioHoliday.sucess);
  });
});
