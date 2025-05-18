import axios from 'axios';
import { describe, expect, test } from 'vitest';
import { testCorsForRoute } from './helpers/cors';

const validOutputSchema = expect.objectContaining({
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

describe('b3 v1 (E2E)', () => {
  describe('GET /tickers/b3/v1/', () => {
    test('Lista todos os tickers', async () => {
      const requestUrl = `${global.SERVER_URL}/api/tickers/b3/v1`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([validOutputSchema])
      );
    });
  });
});

testCorsForRoute('/api/tickers/b3/v1');
