const axios = require('axios');

describe('ipca v1 (E2E)', () => {
  describe('GET indicadores/ipca/v1', () => {
    test('Sem parâmetro de limite', async () => {
      const requestUrl = `${global.SERVER_URL}/api/indicadores/ipca/v1/`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([{ data: '01/02/1991', valor: '19.62' }])
      );
    });

    test('Com parâmetro de limite', async () => {
      const requestUrl = `${global.SERVER_URL}/api/indicadores/ipca/v1?last=2`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data.length).toBe(2);
    });
  });

  describe('GET /ipca/v1/periodo', () => {
    test('Com intervalo válido', async () => {
      const requestUrl = `${global.SERVER_URL}/api/indicadores/ipca/v1/periodo?startDate="2020-01-01"&endDate="2020-05-01"`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([
          { data: '01/01/2020', valor: '0.17' },
          { data: '01/02/2020', valor: '0.35' },
          { data: '01/03/2020', valor: '0.04' },
          { data: '01/04/2020', valor: '0.01' },
          { data: '01/05/2020', valor: '-0.19' },
        ])
      );
    });

    test('Com intervalo inválido', async () => {
      const requestUrl = `${global.SERVER_URL}/api/indicadores/ipca/v1/periodo?startDate="2020-05-01"&endDate="2020-01-01"`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([{ data: '01/05/2020', valor: '-0.19' }])
      );
    });

    test('Com formato de intervalo inválido', async () => {
      const requestUrl = `${global.SERVER_URL}/api/indicadores/ipca/v1/periodo?startDate="01/05/2020"&endDate="01/01/2020"`;

      let response;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        response = error.response;
      }

      expect(response.data).toEqual({
        message: 'Data inválida: "01/05/2020"',
        type: 'bad_request',
        name: 'BadRequestError',
      });
    });
  });
});
