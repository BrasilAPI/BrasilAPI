const axios = require('axios');
const { testCorsForRoute } = require('./helpers/cors');

const requestUrl = `${global.SERVER_URL}/api/cpf/v1`;

describe('api/cpf/v1 (E2E)', () => {
  test('Verifica CORS', async () => {
    const response = await axios.get(`${requestUrl}/05734716901`);

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('Utilizando um CPF válido existente: 05734716901', async () => {
    const response = await axios.get(`${requestUrl}/05734716901`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data.nome).toBeDefined();
    expect(data.cpf).toEqual('05734716901');
  });

  test('Utilizando um CPF válido inexistente: 00000000000', async () => {
    try {
      await axios.get(`${requestUrl}/00000000000`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual({
        error: 'CPF não encontrado',
      });
    }
  });

  test('Utilizando um CPF inválido: 123', async () => {
    try {
      await axios.get(`${requestUrl}/123`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual({
        error: 'CPF inválido',
      });
    }
  });
});

testCorsForRoute('/api/cpf/v1/05734716901');
