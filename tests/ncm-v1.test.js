const axios = require('axios');

describe('ncm v1 (E2E)', () => {
  describe('GET /ncm/v1/:code', () => {
    test('Utilizando um ncm code válido: 33051000', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1/33051000`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        codigo: '3305.10.00',
        descricao: '- Xampus',
        data_inicio: '2022-04-01',
        data_fim: '9999-12-31',
        tipo_ato: 'Res Camex',
        numero_ato: '272',
        ano_ato: '2021',
      });
    });

    test('Utilizando um código inexistente: 00', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1/00`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Código NCM não encontrado',
          type: 'NCM_CODE_NOT_FOUND',
        });
      }
    });
  });

  describe('GET /ncm/v1?search=:description', () => {
    test('Utilizando uma descrição válida: Xampus', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=Xampus`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual([
        {
          codigo: '3305.10.00',
          descricao: '- Xampus',
          data_inicio: '2022-04-01',
          data_fim: '9999-12-31',
          tipo_ato: 'Res Camex',
          numero_ato: '272',
          ano_ato: '2021',
        },
      ]);
    });

    test('Utilizando uma descrição inexistente: localhost', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=localhost`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject([]);
      }
    });
    test('Utilizando um código válido: 330410', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=330410`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual([
        {
          codigo: '3304.10.00',
          descricao: '- Produtos de maquiagem para os lábios',
          data_inicio: '2022-04-01',
          data_fim: '9999-12-31',
          tipo_ato: 'Res Camex',
          numero_ato: '272',
          ano_ato: '2021',
        },
      ]);
    });

    test('Utilizando um código inexistente: 00', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=00`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject([]);
      }
    });
  });

  test('GET /ncm/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/ncm/v1`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
