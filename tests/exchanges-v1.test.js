const axios = require('axios');

describe('banks v1 (E2E)', () => {
  describe('GET /exchanges/v1/:code', () => {
    test('Utilizando um CNPJ válido: 02332886000104', async () => {
      const requestUrl = `${global.SERVER_URL}/api/exchanges/v1/02332886000104`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        cnpj: '02332886000104',
        type: 'CORRETORAS',
        socialName: 'XP INVESTIMENTOS CCTVM S.A.',
        commercialName: 'XP INVESTIMENTOS',
        status: 'EM FUNCIONAMENTO NORMAL',
      });
    });

    test('Utilizando um CNPJ inexistente: 1111111', async () => {
      expect.assertions(2);
      const requestUrl = `${global.SERVER_URL}/api/exchanges/v1/1111111`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'CNPJ não encontrado',
          type: 'CNPJ_NOT_FOUND',
        });
      }
    });
  });

  test('GET /exchanges/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/exchanges/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
