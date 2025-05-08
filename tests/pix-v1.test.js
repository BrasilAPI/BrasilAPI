import axios from 'axios';
import { beforeAll, describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('api/pix/v1/participants (E2E)', () => {
  let requestUrl = '';

  beforeAll(async () => {
    requestUrl = `${global.SERVER_URL}/api/pix/v1/participants`;
  });

  test('should return full list', async () => {
    const response = await axios.get(requestUrl);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);

    expect.arrayContaining([
      expect.objectContaining({
        ispb: expect.any(String),
        nome: expect.any(String),
        nome_reduzido: expect.any(String),
        modalidade_participacao: expect.any(String),
        inicio_operacao: expect.any(String),
      }),
    ]);
  });
});

testCorsForRoute('/api/pix/v1/participants');
