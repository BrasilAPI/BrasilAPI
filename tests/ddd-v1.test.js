const axios = require('axios');

const createServer = require('./helpers/server.js');
const server = createServer();

const scenariosDdd = {
  sucess: require('./helpers/scenarios/ddd/success'),
  inexistent: require('./helpers/scenarios/ddd/inexistent'),
  incorrect: require('./helpers/scenarios/ddd/incorrect')
}

const requestUrl = `${server.getUrl()}/api/ddd/v1`;

beforeAll(async () => {
  await server.start();
})

afterAll(async () => {
  await server.stop();
})

describe('api/ddd/v1 (E2E)', () => {
  test('Utilizando um DDD válido: 12', async () => {
    const response = await axios.get(`${requestUrl}/12`);
    expect(response.data).toEqual(scenariosDdd.sucess);
  });

  test('Utilizando um DDD inexistente: 01', async () => {
    const response = await axios.get(`${requestUrl}/01`);
    expect(response.data).toEqual(scenariosDdd.inexistent);
  });

  test('Utilizando um DDD inválido: 9999', async () => {
    const response = await axios.get(`${requestUrl}/9999`);
    expect(response.data).toEqual(scenariosDdd.incorrect);
  });

});