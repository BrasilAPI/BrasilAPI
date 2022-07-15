const axios = require('axios');

const validClassesTestObject = expect.objectContaining({
  id: expect.any(String),
  descricao: expect.any(String),
  grupo: expect.any(Object),
  observacoes: expect.any(Array),
});

const validClassesTestArray = expect.arrayContaining([validClassesTestObject]);

describe('/ibge/cnae/v1/classes (E2E)', () => {
  test('Obtendo todas as classes CNAE', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/classes`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validClassesTestArray);
  });

  test('Utilizando uma classe válida: 95118', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/classes/95118`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validClassesTestObject);
  });

  test('Utilizando uma classe válida: 01113', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/classes/01113`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validClassesTestObject);
  });

  test('Utilizando uma classe inválida ou inexistente: 11111', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/classes/11111`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'NotFoundError',
        message: 'Classe CNAE não encontrada.',
        type: 'not_found',
      });
    }
  });
});

describe('/ibge/cnae/v1/divisoes (E2E)', () => {
  test('Utilizando uma divisão válida: 85', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/divisoes/1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validClassesTestArray);
  });

  test('Utilizando uma divisão inválida: 0', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/divisoes/0`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'NotFoundError',
        message: 'Divisão CNAE não encontrada.',
        type: 'not_found',
      });
    }
  });
});

describe('/ibge/cnae/v1/grupos (E2E)', () => {
  test('Utilizando um grupo CNAE válido: 951', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/grupos/951`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validClassesTestArray);
  });

  test('Utilizando um grupo CNAE válido: 111', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/grupos/111`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validClassesTestArray);
  });

  test('Utilizando um grupo CNAE inválido ou inexistente: 000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/cnae/v1/grupos/000`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'NotFoundError',
        message: 'Grupo CNAE não encontrado.',
        type: 'not_found',
      });
    }
  });
});
