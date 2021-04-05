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

    test('Listar bancos por parte de nome', async () => {
      const search = 'inter';

      const requestUrl = `${global.SERVER_URL}/api/banks/v1?search=${search}`;
      const response = await axios.get(requestUrl);

      const expectedResponse = [
        {
          ispb: '00416968',
          name: 'BANCO INTER',
          code: 77,
          fullName: 'Banco Inter S.A.',
        },
        {
          ispb: '04391007',
          name: 'CAMARA INTERBANCARIA DE PAGAMENTOS - CIP',
          code: null,
          fullName: 'Câmara Interbancária de Pagamentos',
        },
      ];

      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });

    test('Listar bancos por parte do código', async () => {
      const search = 77;

      const requestUrl = `${global.SERVER_URL}/api/banks/v1?search=${search}`;
      const response = await axios.get(requestUrl);

      const expectedResponse = [
        {
          ispb: '00416968',
          name: 'BANCO INTER',
          code: 77,
          fullName: 'Banco Inter S.A.',
        },
        {
          ispb: '17826860',
          name: 'BMS SCD S.A.',
          code: 377,
          fullName: 'BMS SOCIEDADE DE CRÉDITO DIRETO S.A.',
        },
        {
          ispb: '33042953',
          name: 'CITIBANK N.A.',
          code: 477,
          fullName: 'Citibank N.A.',
        },
        {
          ispb: '65913436',
          name: 'GUIDE',
          code: 177,
          fullName: 'Guide Investimentos S.A. Corretora de Valores',
        },
      ];

      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });
  });
});
