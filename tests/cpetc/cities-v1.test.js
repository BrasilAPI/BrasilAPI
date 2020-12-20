const axios = require('axios');

describe('cities v1 (E2E)', () => {
  describe('GET /cptec/v1/cities/:name', () => {
    test('Utilizando um nome de cidade existente: São Sebastião', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cities/São Sebastião`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data[1]).toEqual({
        code: '5051',
        name: 'São Sebastião',
        state: 'SP'
      });
    });

    test('Utilizando um nome de cidade inexistente: chiforímpola', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cities/chiforímpola`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        console.log(error);
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Nenhuma cidade localizada',
          type: 'NO_CITY_NOT_FOUND',
        });
      }
    });
  });

  test('GET /cptec/v1/cities', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/cities`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
