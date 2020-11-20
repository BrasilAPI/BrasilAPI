const axios = require('axios');

const createServer = require('./helpers/server.js');

const server = createServer();

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe('/rastreio/v1 (E2E)', () => {
  test('Utilizando um código de rastreio válido: OL312467368BR', async () => {
    const requestUrl = `${server.getUrl()}/api/rastreio/v1/OL312467368BR`;
    const response = await axios.get(requestUrl);
    expect(response.data).toMatchObject([
      {
        data: '13/11/2020',
        dataHora: '13/11/2020 15:13',
        descricao: 'Objeto entregue ao destinatário',
        cidade: 'Guapo',
        uf: 'GO'
      },
      {
        data: '13/11/2020',
        dataHora: '13/11/2020 15:11',
        descricao: 'Objeto saiu para entrega ao destinatário',
        cidade: 'Guapo',
        uf: 'GO'
      },
      {
        data: '12/11/2020',
        dataHora: '12/11/2020 09:30',
        descricao: 'Objeto em trânsito - por favor aguarde',
        cidade: 'APARECIDA DE GOIANIA',
        uf: 'GO',
        destino: { cidade: 'Guapo', uf: 'GO' }
      },
      {
        data: '10/11/2020',
        dataHora: '10/11/2020 19:00',
        descricao: 'Objeto em trânsito - por favor aguarde',
        cidade: 'CAJAMAR',
        uf: 'SP',
        destino: { cidade: 'GOIANIA', uf: 'GO' }
      },
      {
        data: '09/11/2020',
        dataHora: '09/11/2020 10:51',
        descricao: 'Objeto em trânsito - por favor aguarde',
        cidade: 'Santos',
        uf: 'SP',
        destino: { cidade: 'CAJAMAR', uf: 'SP' }
      },
      {
        data: '06/11/2020',
        dataHora: '06/11/2020 15:23',
        descricao: 'Objeto postado',
        cidade: 'Santos',
        uf: 'SP'
      }
    ]);
  });

  test('Utilizando um código de rastreio inválido: OL412467368BR', async () => {
    const requestUrl = `${server.getUrl()}/api/rastreio/v1/OL412467368BR`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        error: "service_error",
        message: "O serviço não retornou eventos para este código de rastreio."
      });
    }
  });

  test('Utilizando um código de rastreio com caracteres inválidos: OLs412467368BR', async () => {
    const requestUrl = `${server.getUrl()}/api/rastreio/v1/OLs412467368BR`;
    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({
        error: "validation_error",
        message: "O código de rastreio deve conter 13 caracteres."
      });
    }
  });
});
