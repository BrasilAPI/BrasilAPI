const axios = require('axios');

const validRegionObject = {
  id: expect.any(Number),
  nome: expect.any(String),
  UF: expect.objectContaining({
    id: expect.any(Number),
    sigla: expect.any(String),
    nome: expect.any(String),
    regiao: expect.objectContaining({
      id: expect.any(Number),
      sigla: expect.any(String),
      nome: expect.any(String),
    }),
  }),
};

const validTestArray = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(Number),
    nome: expect.any(String),
    municipio: expect.objectContaining({
      id: expect.any(Number),
      nome: expect.any(String),
      microrregiao: expect.objectContaining({
        id: expect.any(Number),
        nome: expect.any(String),
        mesorregiao: expect.objectContaining(validRegionObject),
      }),
      'regiao-imediata': expect.objectContaining({
        id: expect.any(Number),
        nome: expect.any(String),
        'regiao-intermediaria': expect.objectContaining(validRegionObject),
      }),
    }),
  }),
]);

describe('/ibge/municipios/v1 (E2E)', () => {
  test('Utilizando um codigo válido: 22', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/22`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });

  test('Utilizando um Codigo inexistente ou inválido: 99', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/99`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
    }
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

  test('Utilizando um sigla inexistente ou inválida: AA', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/municipios/v1/AA`;

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
