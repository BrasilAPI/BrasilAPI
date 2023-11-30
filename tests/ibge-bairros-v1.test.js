const axios = require('axios');

const requestUrl = `${global.SERVER_URL}/api/ibge/bairros/v1`;

describe('api/ibge/bairros/v1 (E2E)', () => {
  test('Utilizando uma cidade e estado válidos: São-José-dos-Campos,SP', async () => {
    const response = await axios.get(`${requestUrl}/São-José-dos-Campos,SP`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data.bairros).toBeDefined();
    expect(data.bairros.length).toBeGreaterThan(0);
  });

  test('Utilizando um formato inválido de cidade e estado: Sao Jose dos Campos,SP', async () => {
    try {
      await axios.get(`${requestUrl}/Sao Jose dos Campos,SP`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual({
        mensagem: 'Formato inválido de cidade e estado.',
      });
    }
  });

  test('Utilizando uma cidade ou estado inexistente: CidadeInexistente,SP', async () => {
    try {
      await axios.get(`${requestUrl}/CidadeInexistente,SP`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual({ mensagem: 'Cidade ou estado não encontrado.' });
    }
  });
});
