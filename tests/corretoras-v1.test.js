const axios = require('axios');

const validTestTableArray = expect.arrayContaining([
  expect.objectContaining({
    cnpj: expect.any(String),
    nome_social: expect.any(String),
    nome_comercial: expect.any(String),
  }),
]);

describe('corretoras v1 (E2E)', () => {
  describe('GET /cvm/corretoras/v1/:cnpj', () => {
    test('Utilizando um CNPJ válido: 02332886000104', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1/02332886000104`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        cnpj: '02332886000104',
        nome_social: 'XP INVESTIMENTOS CCTVM S.A.',
        nome_comercial: 'XP INVESTIMENTOS',
      });
    });

    test('Utilizando um CNPJ inexistente: 1111111', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1/1111111`;

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

  test('GET /cvm/corretoras/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toEqual(validTestTableArray);
  });
});
