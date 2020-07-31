const axios = require('axios');

const createServer = require('./helpers/server.js');

const server = createServer();

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe('/ibge/uf/v1 (E2E)', () => {
  test('Utilizando um Codigo válido: 22', async () => {
    const requestUrl = `${server.getUrl()}/api/ibge/uf/v1/22`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: 22,
      sigla: expect.any(String),
      nome: expect.any(String),
      regiao: expect.objectContaining({
        id: expect.any(Number),
        sigla: expect.any(String),
        nome: expect.any(String),
      }),
    });
  });

  test('Utilizando um Codigo inexistente ou inválido: 99', async () => {
    const requestUrl = `${server.getUrl()}/api/ibge/uf/v1/99`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
    }
  });

  test('Buscando todas as ufs', async () => {
    const requestUrl = `${server.getUrl()}/api/ibge/uf/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          sigla: expect.any(String),
          nome: expect.any(String),
          regiao: expect.objectContaining({
            id: expect.any(Number),
            sigla: expect.any(String),
            nome: expect.any(String),
          }),
        }),
      ])
    );
  });
});
