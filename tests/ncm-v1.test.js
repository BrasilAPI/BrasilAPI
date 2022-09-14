const axios = require('axios');

describe('ncm v1 (E2E)', () => {
  describe('GET /ncm/v1/:code', () => {
    test('Utilizando um ncm code válido: 33051000', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1/33051000`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        Codigo: '3305.10.00',
        Descricao: '- Xampus',
        Data_Inicio: '2022-01-04',
        Data_Fim: '9999-12-31',
        Tipo_Ato: 'Res Camex',
        Numero_Ato: '000272',
        Ano_Ato: '2021',
      });
    });

    test('Utilizando um código inexistente: 00', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1/0`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        message: 'Código NCM não encontrado',
        type: 'NCM_CODE_NOT_FOUND',
      });
    });
  });

  describe('GET /ncm/v1?search=:description', () => {
    test('Utilizando uma descrição válida: Xampus', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=Xampus`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual([
        {
          Codigo: '3305.10.00',
          Descricao: '- Xampus',
          Data_Inicio: '2022-01-04',
          Data_Fim: '9999-12-31',
          Tipo_Ato: 'Res Camex',
          Numero_Ato: '000272',
          Ano_Ato: '2021',
        },
      ]);
    });

    test('Utilizando uma descrição inexistente: localhost', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=localhost`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject([]);
    });
    test('Utilizando um código válido: 330410', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=330410`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual([
        {
          Codigo: '3304.10.00',
          Descricao: '- Produtos de maquiagem para os lábios',
          Data_Inicio: '2022-04-01',
          Data_Fim: '9999-12-31',
          Tipo_Ato: 'Res Camex',
          Numero_Ato: '000272',
          Ano_Ato: '2021',
        },
      ]);
    });

    test('Utilizando um código inexistente: 00', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1?search=00`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(200);
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
