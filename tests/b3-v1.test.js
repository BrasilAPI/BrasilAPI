import axios from 'axios';
import { describe, expect, test } from 'vitest';
import { testCorsForRoute } from './helpers/cors';

const validStockOutputSchema = expect.objectContaining({
  code_CVM: expect.any(String),
  issuing_company: expect.any(String),
  company_name: expect.any(String),
  trading_name: expect.any(String),
  cnpj: expect.any(String),
  market_indicator: expect.any(String),
  type_BDR: expect.any(String),
  date_listing: expect.any(String),
  status: expect.any(String),
  segment: expect.any(String),
  segment_eng: expect.any(String),
  type: expect.any(String),
  market: expect.any(String),
});

const validFundOutputSchema = expect.objectContaining({
  id: expect.any(Number),
  type_name: expect.toBeOneOf([expect.any(String), null]),
  acronym: expect.any(String),
  fund_name: expect.any(String),
  trading_name: expect.any(String),
});

describe('b3 v1 (E2E)', () => {
  describe('GET /tickers/b3/acoes/v1/', () => {
    test('Lista todos os tickers', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/acoes/v1`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validStockOutputSchema])
      );
    });
  });

  describe('GET /tickers/b3/fundos/v1/', () => {
    test('Lista tickers de fundos tipo FII', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/fundos/v1/FII`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validFundOutputSchema])
      );
    });

    test('Lista tickers de fundos tipo SETORIAL', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/fundos/v1/SETORIAL`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validFundOutputSchema])
      );
    });

    test('Lista tickers de fundos tipo FIAGRO-FII', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/fundos/v1/FIAGRO-FII`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validFundOutputSchema])
      );
    });

    test('Lista tickers de fundos tipo FIAGRO-FIDC', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/fundos/v1/FIAGRO-FIDC`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validFundOutputSchema])
      );
    });

    test('Lista tickers de fundos tipo FIAGRO-FIP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/fundos/v1/FIAGRO-FIP`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validFundOutputSchema])
      );
    });

    test('Lista tickers de fundos tipo FIP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/fundos/v1/FIP`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validFundOutputSchema])
      );
    });

    test('Lista tickers de fundos tipo FIA', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/fundos/v1/FIA`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validFundOutputSchema])
      );
    });
  });
});

testCorsForRoute('/api/tickers/b3/acoes/v1');
testCorsForRoute('/api/tickers/b3/fundos/v1/FII');
testCorsForRoute('/api/tickers/b3/fundos/v1/SETORIAL');
testCorsForRoute('/api/tickers/b3/fundos/v1/FIAGRO-FII');
testCorsForRoute('/api/tickers/b3/fundos/v1/FIAGRO-FIDC');
testCorsForRoute('/api/tickers/b3/fundos/v1/FIAGRO-FIP');
testCorsForRoute('/api/tickers/b3/fundos/v1/FIP');
testCorsForRoute('/api/tickers/b3/fundos/v1/FIA');
