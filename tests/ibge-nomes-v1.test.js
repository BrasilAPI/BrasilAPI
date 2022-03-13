const axios = require('axios');

expect.extend({
  toBeStringOrNull(received) {
    if (received === null || typeof received === 'string') {
      return {
        message: () => `ok`,
        pass: true,
      };
    }

    return {
      message: () => `expected ${received} to be boolean or null`,
      pass: false,
    };
  },
});

const frequencyNameTest = expect.objectContaining({
  nome: expect.any(String),
  localidade: expect.any(String),
  sexo: expect.toBeStringOrNull(),
  res: expect.arrayContaining([
    expect.objectContaining({
      periodo: expect.any(String),
      frequencia: expect.any(Number),
    }),
  ]),
});

const frequencyArrayNameTest = expect.arrayContaining([frequencyNameTest]);

const rankingNameTest = expect.objectContaining({
  localidade: expect.any(String),
  sexo: expect.toBeStringOrNull(),
  res: expect.arrayContaining([
    expect.objectContaining({
      nome: expect.any(String),
      frequencia: expect.any(Number),
      ranking: expect.any(Number),
    }),
  ]),
});

describe('/ibge/nomes/v1 (E2E)', () => {
  test('Utilizando um nome válido: Pedro', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/nomes/v1/pedro`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(frequencyNameTest);
  });

  test('Utilizando múltiplos nomes válidos: Pedro e Gabriel', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/nomes/v1/pedro|gabriel`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(frequencyArrayNameTest);
  });

  test('Utilizando nome válido só no Rio de Janeiro', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/nomes/v1/pedro`;
    const response = await axios.get(requestUrl, {
      localidade: 33, // Rio de Janeiro
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(frequencyNameTest);
  });

  test('Utilizando nomes femininos válidos: Ana', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/nomes/v1/ana`;
    const response = await axios.get(requestUrl, {
      params: {
        sexo: 'f',
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(frequencyNameTest);
    expect(response.data.sexo).toBe('F');
  });

  test('Utilizando nome inexistente', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/nomes/v1/bababuia`;
    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'NotFoundError',
        message: 'Nome não encontrado.',
        type: 'not_found',
      });
    }
  });
});

describe('/ibge/nomes/v1/ranking (E2E)', () => {
  test('Buscando o ranking', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/nomes/v1/ranking`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(rankingNameTest);
  });

  test('Buscando o ranking só com sexo feminino', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/nomes/v1/ranking`;
    const response = await axios.get(requestUrl, {
      sexo: 'f',
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(rankingNameTest);
  });

  test('Buscando o ranking com nomes do Rio de Janeiro', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ibge/nomes/v1/ranking`;
    const response = await axios.get(requestUrl, {
      localidade: 33, // Rio de Janeiro
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(rankingNameTest);
  });
});
