const axios = require('axios');

const createServer = require('./helpers/server.js');

const server = createServer();

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe('/camara/v1/partidos (E2E)', () => {
  test('Requisitando todos os partidos', async () => {
    const requestUrl = `${server.getUrl()}/api/camara/v1/partidos`;
    const response = await axios.get(requestUrl);

    expect(response.data).toMatchObject({
      status: 'ok',
      partidos: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          sigla: expect.any(String),
          nome: expect.any(String),
          uri: expect.any(String)
        })
      ])
    });
  });

  test('Requisitando dados de um único partido', async () => {
    const requestUrl = `${server.getUrl()}/api/camara/v1/partidos/37901`;
    const response = await axios.get(requestUrl);

    expect(response.data).toMatchObject({
      status: 'ok',
      info: expect.objectContaining({
        id: 37901,
        sigla: 'NOVO',
        nome: 'Partido Novo',
        uri: 'https://dadosabertos.camara.leg.br/api/v2/partidos/37901',
      })
    });
  });

  test('Requisitando dados de um único partido com seus membros', async () => {
    const requestUrl = `${server.getUrl()}/api/camara/v1/partidos/37901?incluirMembros=true`;
    const response = await axios.get(requestUrl);

    expect(response.data).toMatchObject({
      status: 'ok',
      info: expect.objectContaining({
        id: 37901,
        sigla: 'NOVO',
        nome: 'Partido Novo',
        uri: 'https://dadosabertos.camara.leg.br/api/v2/partidos/37901',
        membros: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            uri: expect.any(String),
            nome: expect.any(String),
            siglaPartido: "NOVO",
            uriPartido: "https://dadosabertos.camara.leg.br/api/v2/partidos/37901",
            siglaUf: expect.any(String),
            idLegislatura: expect.any(Number),
            urlFoto: expect.any(String),
            email: expect.any(String)
          })
        ])
      })
    });
  });

  test('Requisitando dados de um partido inválido', async () => {
    expect.assertions(2);
    const requestUrl = `${server.getUrl()}/api/camara/v1/partidos/0`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        status: 'error',
        message: 'Este partido não existe.'
      });
    }
  });
});
