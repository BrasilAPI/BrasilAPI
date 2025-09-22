const axios = require('axios');

describe('/ibge/regioes/v1 (E2E)', () => {
  test('Utilizando um Codigo válido: 1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/regioes/v1/1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        sigla: expect.any(String),
        nome: expect.any(String),
      })
    );
  });

  test('Buscando todas as regiões', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/regioes/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          sigla: expect.any(String),
          nome: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando um Codigo inexistente ou inválido: 99', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/regioes/v1/99`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
    }
  });

  test('Utilizando uma Sigla válida: S', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/regioes/v1/S`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        sigla: expect.any(String),
        nome: expect.any(String),
      })
    );
  });

  test('Utilizando um sigla inexistente ou inválida: PP', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/regioes/v1/PP`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'NotFoundError',
        message: 'Região não encontrada.',
        type: 'not_found',
      });
    }
  });
});
