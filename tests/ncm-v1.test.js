const axios = require('axios');

const validOutputSchema = expect.objectContaining({
  codigo: expect.any(String),
  descricao: expect.any(String),
  data_inicio: expect.any(String),
  data_fim: expect.any(String),
  tipo_ato_ini: expect.any(String),
  numero_ato_ini: expect.any(String),
  ano_ato_ini: expect.any(String),
});

describe('ncm v1 (E2E)', () => {
  describe('GET /ncm/v1/:code', () => {
    test('Utilizando um ncm code válido: 33051000', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ncm/v1/33051000`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validOutputSchema);

      expect(response.data.codigo).toBe('3305.10.00');
      expect(response.data.descricao).toContain('Xampus');
      expect(response.data.data_inicio).toBe('2022-04-01');
      expect(response.data.ano_ato_ini).toBe('2021');
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
      expect(response.data).toEqual(
        expect.arrayContaining([validOutputSchema])
      );

      const firstRow = response.data[0];

      expect(firstRow.codigo).toBe('3305.10.00');
      expect(firstRow.descricao).toContain('Xampus');
      expect(firstRow.data_inicio).toBe('2022-04-01');
      expect(firstRow.ano_ato_ini).toBe('2021');
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

      expect(response.data).toEqual(
        expect.arrayContaining([validOutputSchema])
      );
      const firstRow = response.data[0];

      expect(firstRow.codigo).toBe('3304.10.00');
      expect(firstRow.descricao).toContain('maquiagem para os lábios');
      expect(firstRow.data_inicio).toBe('2022-04-01');
      expect(firstRow.ano_ato_ini).toBe('2021');
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
