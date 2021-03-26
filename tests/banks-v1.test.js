const axios = require('axios');

describe('banks v1 (E2E)', () => {
  describe('GET /banks/v1/:code', () => {
    test('Utilizando um bank code válido: 260', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/260`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        ispb: '18236120',
        name: 'NU PAGAMENTOS S.A.',
        code: 260,
        fullName: 'Nu Pagamentos S.A.',
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

  describe('GET /banks/v1/:code', () => {
    test('Listar todos os bancos', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('Listar bancos por parte de nome ou código', async () => {
      const queryName = 'inter';

      const requestUrl = `${global.SERVER_URL}/api/banks/v1?search=${queryName}`;
      const response = await axios.get(requestUrl);

      const filterNamesFromBanks = response.data.map(
        ({ name }) =>
          !!String(name).toLowerCase().includes(queryName.toLowerCase())
      );

      expect(response.status).toBe(200);
      expect(
        filterNamesFromBanks.every((nameCheck) => nameCheck === true)
      ).toBe(true);
    });
  });
});
