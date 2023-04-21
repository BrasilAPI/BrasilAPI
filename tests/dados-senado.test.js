const axios = require('axios');

const URL = `${global.SERVER_URL}/api/senado/v1/gestao/servidores`;

describe('api/senado/v1/gestao/servidores (E2E)', () => {
  test('Pesquisando Relação de servidores efetivos do Governo do Distrito Federal à disposição do Senado Federal', async () => {
    const response = await axios.get(`${URL}`);
    expect(response.status).toBe(200);
  });
});

describe('api/senado/v1/gestao/servidores/efetivos (E2E)', () => {
  test('Pesquisando Relação de servidores efetivos do Senado Federal', async () => {
    const response = await axios.get(`${URL}/efetivos`);
    expect(response.status).toBe(200);
  });
});