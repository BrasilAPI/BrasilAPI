const axios = require('axios');

describe('/ibge/uf/v1 (E2E)', () => {
  test('Utilizando um Codigo válido: 22', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/22`;
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
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/99`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
    }
  });

  test('Buscando todas as ufs', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1`;
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

  test('Utilizando uma Sigla válida: sc', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/sc`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: 42,
      sigla: expect.any(String),
      nome: expect.any(String),
      regiao: expect.objectContaining({
        id: expect.any(Number),
        sigla: expect.any(String),
        nome: expect.any(String),
      }),
    });
  });

  test('Utilizando uma Sigla válida: PI', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/PI`;
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

  test('Utilizando um sigla inexistente ou inválida: SJ', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/uf/v1/SJ`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'NotFoundError',
        message: 'UF não encontrado.',
        type: 'not_found',
      });
    }
  });
});
