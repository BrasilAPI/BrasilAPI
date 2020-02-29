const axios = require('axios');

const createServer = require('./helpers/server.js');
const server = createServer();

const scenariosDdd = {
  sucess: require('./scenarios/ddd/success'),
  inexistent: require('./scenarios/ddd/inexistent'),
  incorrect: require('./scenarios/ddd/incorrect')
}

const requestUrl = `${server.getUrl()}/api/cities/v1/ddd`;

beforeAll(async () => {
  await server.start();
})

afterAll(async () => {
  await server.stop();
})

describe('api/cities/v1/ddd/ (E2E)', () => {
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