const axios = require('axios');

const SCENARIO_DDD_SUCCESS = require('./helpers/scenarios/ddd/success');
const SCENARIO_DDD_INEXISTENT = require('./helpers/scenarios/ddd/inexistent');
const SCENARIO_DDD_INCORRECT = require('./helpers/scenarios/ddd/incorrect');

const createServer = require('./helpers/server.js');

const server = createServer();

const requestUrl = `${server.getUrl()}/api/ddd/v1`;

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe.skip('api/ddd/v1 (E2E)', () => {
  test('Utilizando um DDD válido: 12', async () => {
    const response = await axios.get(`${requestUrl}/12`);
    expect(response.data).toEqual(SCENARIO_DDD_SUCCESS);
  });

  test('Utilizando um DDD inexistente: 01', async () => {
    const response = await axios.get(`${requestUrl}/01`);
    expect(response.data).toEqual(SCENARIO_DDD_INEXISTENT);
  });

  test('Utilizando um DDD inválido: 9999', async () => {
    const response = await axios.get(`${requestUrl}/9999`);
    expect(response.data).toEqual(SCENARIO_DDD_INCORRECT);
  });
});
