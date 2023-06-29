const axios = require('axios');

describe('Cambio v1 (E2E)', () => {
  describe('GET /cambio/:moeda/:data', () => {
    test('Utilizando moeda e data válida: USD e 27-06-2023', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/USD/2023-06-27`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        price: { isoCode: 'BRL', symbol: 'R$', value: 4.7903 },
        currency: 'USD',
        date: '2023-06-27',
      });
    });

    test('Utilizando moeda inexistente e data válida: ZZZ e 2023-06-27', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/ZZZ/2023-06-27`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message:
            'Tipo de moeda inválida, os tipos disponíveis são: AUD,CAD,CHF,DKK,EUR,GBP,JPY,NOK,SEK,USD',
          type: 'currency_error',
          name: 'INVALID_CURRENCY_VALUE',
        });
      }
    });

    test('Utilizando moeda válida e data com formato inapropriado: USD e 27-06-2023', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/USD/27-06-2023`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Formato de data inválida, utilize: AAAA-MM-DD',
          type: 'format_error',
          name: 'DATE_FORMAT_INCORRECT_PATTERN',
        });
      }
    });

    test('Utilizando moeda válida e utilizando um dia não útil (fim de semana): USD e 2023-06-27', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/USD/2023-06-27`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Não existem cotações para os finais de semanas',
          type: 'weekend_error',
          name: 'NO_WEEKEND_PRICE',
        });
      }
    });

    test('Tentando utilizar uma data futura ao dia da consulta: USD e 2050-06-27', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/USD/2050-06-27`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Datas futuras não são permitidas',
          type: 'future_date_error',
          name: 'NO_FUTURE_DATE',
        });
      }
    });

    test('Datas anteriores ao início da base de dados (1984-11-28): USD e 1984-05-28', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/USD/1984-05-28`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Dados a partir do dia 1984-11-28',
          type: 'data_avaliable_error',
          name: 'NO_DATA_AVALIABLE',
        });
      }
    });
  });
});
