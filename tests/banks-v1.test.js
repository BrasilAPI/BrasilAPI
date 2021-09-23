const axios = require('axios');

describe('banks v1 (E2E)', () => {
  describe('GET /banks/v1/:code', () => {
    test('Utilizando um bank code válido: 260', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/260`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        ispb: '18236120',
        name: 'NU PAGAMENTOS - IP',
        code: 260,
        fullName: 'NU PAGAMENTOS S.A. - INSTITUIÇÃO DE PAGAMENTO',
      });
    });

    test('Utilizando um código inexistente: 1111111', async () => {
      expect.assertions(2);
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/1111111`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Código bancário não encontrado',
          type: 'BANK_CODE_NOT_FOUND',
        });
      }
    });
  });

  test('GET /banks/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/banks/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
