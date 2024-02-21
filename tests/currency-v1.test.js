const axios = require('axios');

const GET_ALL_CURRENCIES = `${global.SERVER_URL}/api/currency/v1`;
const GET_EXCHANGE = `${global.SERVER_URL}/api/currency/v1/exchange`;

describe('currency v1 (E2E)', () => {
  describe('GET /currency/v1', () => {
    test('get all currenties', async () => {
      const response = await axios.get(GET_ALL_CURRENCIES);
      const { data, status } = response;

      expect(status).toEqual(200);
      expect(data[0].code).toBeTruthy();
      expect(data[0].name).toBeTruthy();
    });
  });

  describe('GET /currency/v1/exchange', () => {
    test('get exchange', async () => {
      const response = await axios.get(GET_EXCHANGE, {
        params: {
          from: 'BRL',
          to: 'USD',
        },
      });

      const { data, status } = response;

      expect(status).toEqual(200);
      expect(data.priceToSell).toBeTruthy();
      expect(data.priceToBuy).toBeTruthy();
      expect(data.variation).toBeTruthy();
      expect(data.variationPercentage).toBeTruthy();
      expect(data.maxPrice).toBeTruthy();
      expect(data.minPrice).toBeTruthy();
      expect(data.priceToSell).toBeTruthy();
      expect(data.avgPrice).toBeTruthy();
    });

    test('not provide to currency param ', async () => {
      try {
        await axios.get(GET_EXCHANGE, {
          params: {
            from: 'BRL',
          },
        });
      } catch (error) {
        const { data, status } = error.response;

        expect(status).toEqual(400);
        expect(data).toMatchObject({
          message: 'Parameter to is required',
          type: 'bad_request',
          name: 'BadRequestError',
        });
      }
    });

    test('not provide from currency param ', async () => {
      try {
        await axios.get(GET_EXCHANGE);
      } catch (error) {
        const { data, status } = error.response;

        expect(status).toEqual(400);
        expect(data).toMatchObject({
          message: 'Parameter from is required',
          type: 'bad_request',
          name: 'BadRequestError',
        });
      }
    });

    test('provide invalid currency', async () => {
      try {
        await axios.get(GET_EXCHANGE, {
          params: {
            from: 'invalid',
            to: 'currency',
          },
        });
      } catch (error) {
        const { data, status } = error.response;

        expect(status).toEqual(404);
        expect(data).toMatchObject({
          message: 'Cannot found any exchange between invalid and currency',
          type: 'not_found',
          name: 'NotFoundError',
        });
      }
    });
  });
});
