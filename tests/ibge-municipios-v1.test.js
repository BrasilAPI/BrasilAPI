const axios = require('axios');

const validTestArray = expect.arrayContaining([
  expect.objectContaining({
    nome: expect.any(String),
    codigo_ibge: expect.any(String),
  }),
]);

// TODO: This test is intermitent at Github Actions provider
describe.skip('/ibge/municipios/v1 (E2E)', () => {
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  test('Utilizando uma sigla válida: SC', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/SC`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });

  test('Utilizando uma sigla válida: RS', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/RS`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });

  test('Utilizando uma sigla inexistente ou inválida: AA', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/AA`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'NotFoundError',
        message: 'UF não encontrada',
        type: 'not_found',
      });
    }
  });
});
