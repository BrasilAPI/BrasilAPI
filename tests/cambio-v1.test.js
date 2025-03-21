import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { describe, expect, test } from 'vitest';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDate = (date, format = 'DD/MM/YYYY') => dayjs(date).format(format);

describe('Cambio v1 (E2E)', () => {
  describe('GET /cambio/v1/cotacao/:moeda/:data', () => {
    test('Verifica CORS', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao/USD/2023-06-27`;
      const response = await axios.get(requestUrl);

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
    test('Utilizando moeda e data válida: USD e 2023-06-27', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao/USD/2023-06-27`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        cotacoes: [
          {
            paridade_compra: 1,
            paridade_venda: 1,
            cotacao_compra: 4.7604,
            cotacao_venda: 4.761,
            data_hora_cotacao: '2023-06-27 10:06:16.012',
            tipo_boletim: 'ABERTURA',
          },
          {
            paridade_compra: 1,
            paridade_venda: 1,
            cotacao_compra: 4.7925,
            cotacao_venda: 4.7931,
            data_hora_cotacao: '2023-06-27 11:05:16.603',
            tipo_boletim: 'INTERMEDIÁRIO',
          },
          {
            paridade_compra: 1,
            paridade_venda: 1,
            cotacao_compra: 4.8006,
            cotacao_venda: 4.8012,
            data_hora_cotacao: '2023-06-27 12:03:17.018',
            tipo_boletim: 'INTERMEDIÁRIO',
          },
          {
            paridade_compra: 1,
            paridade_venda: 1,
            cotacao_compra: 4.8054,
            cotacao_venda: 4.806,
            data_hora_cotacao: '2023-06-27 13:05:03.701',
            tipo_boletim: 'INTERMEDIÁRIO',
          },
          {
            paridade_compra: 1,
            paridade_venda: 1,
            cotacao_compra: 4.7897,
            cotacao_venda: 4.7903,
            data_hora_cotacao: '2023-06-27 13:05:03.712',
            tipo_boletim: 'FECHAMENTO PTAX',
          },
        ],
        moeda: 'USD',
        data: '2023-06-27',
      });
    });

    test('Utilizando moeda inexistente e data válida: ZZZ e 2023-06-27', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao/ZZZ/2023-06-27`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message:
            'Tipo de moeda inválida, os tipos disponíveis são: AUD, CAD, CHF, DKK, EUR, GBP, JPY, NOK, SEK, USD',
          type: 'currency_error',
          name: 'INVALID_CURRENCY_VALUE',
        });
      }
    });

    test('Utilizando moeda válida e data com formato inapropriado: USD e 27-06-2023', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao/USD/27-06-2023`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Formato de data inválida, utilize: YYYY-MM-DD',
          type: 'format_error',
          name: 'DATE_FORMAT_INCORRECT_PATTERN',
        });
      }
    });

    test('Utilizando moeda válida e utilizando um dia não útil (fim de semana): USD e 2025-02-16', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao/USD/2025-02-16`;

      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data.data).toBe('2025-02-14');
      expect(response.data.moeda).toBe('USD');
      expect(Array.isArray(response.data.cotacoes)).toBe(true);
    });

    test('Tentando utilizar uma data futura ao dia da consulta: USD', async () => {
      const today = new Date();
      const fiveYearsLater = dayjs(today).add(5, 'year').format('YYYY-MM-DD');
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao/USD/${fiveYearsLater}`;

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
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao/USD/1984-05-28`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Dados a partir do dia 1984-11-28',
          type: 'data_available_error',
          name: 'NO_DATA_AVAILABLE',
        });
      }
    });

    test('Não deve permitir acesso a cotação de hoje', async () => {
      const today = formatDate(new Date(), 'YYYY-MM-DD');
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao/USD/${today}`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message:
            'Não é possível consultar a cotação do dia de hoje devido a política de cache',
          type: 'today_date_error',
          name: 'NO_TODAY_DATE',
        });
      }
    });
  });
  describe('GET /cambio/v1/moedas', () => {
    test('Verifica CORS', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/moedas`;
      const response = await axios.get(requestUrl);

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
    test('Lista moedas', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cambio/v1/moedas`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            simbolo: expect.any(String),
            nome: expect.any(String),
            tipo_moeda: expect.any(String),
          }),
        ])
      );
    });
  });
});
