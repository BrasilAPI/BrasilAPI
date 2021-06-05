const axios = require('axios');

describe('cities v1 (E2E)', () => {
  describe('GET /cptec/v1/cidade/:name', () => {
    test('Utilizando um nome de cidade existente: São Sebastião', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cidade/São Sebastião`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data[1]).toEqual({
        code: '5051',
        name: 'São Sebastião',
        state: 'SP',
      });
    });

    test('Utilizando um nome de cidade inexistente: chiforímpola', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cidade/chiforímpola`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Nenhuma cidade localizada',
          type: 'city_error',
          name: 'NO_CITY_NOT_FOUND',
        });
      }
    });
  });

  test('GET /cptec/v1/cidade', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cidade`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
