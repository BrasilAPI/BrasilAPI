const axios = require('axios');

const createServer = require('./helpers/server.js')
const server = createServer();

const requestUrl = `${server.getUrl()}/api/cities/v1/uf`;

const scenariosUf = {
  sucess: require('./scenarios/uf/success'),
  inexistent: require('./scenarios/uf/inexistent'),
  incorrect: require('./scenarios/uf/incorrect')
}


beforeAll(async () => {
  await server.start();
})

afterAll(async () => {
  await server.stop();
})

describe('api/cities/v1/uf/ (E2E)', () => {
  test('Utilizando um UF válido: DF (Distrito Federal)', async () => {
    const response = await axios.get(`${requestUrl}/df`);
    expect(response.data).toEqual(scenariosUf.sucess);
  });

  test('Utilizando um UF inexistente: 01', async () => {
    const response = await axios.get(`${requestUrl}/vm`);
    expect(response.data).toEqual(scenariosUf.inexistent);
  });

  test('Utilizando um UF inválido: 9999', async () => {
    const response = await axios.get(`${requestUrl}/abcd`);
    expect(response.data).toEqual(scenariosUf.incorrect);
  });

});