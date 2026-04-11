import axios from 'axios';
import { describe, expect, test } from 'vitest';

const validOutputSchema = expect.objectContaining({
  ispb: expect.any(String),
  name: expect.any(String),
  code: expect.any(Number),
  fullName: expect.any(String),
});

describe('banks v1 (E2E)', () => {
  describe('GET /banks/v1/:code', () => {
    test('Verifica CORS', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/260`;
      const response = await axios.get(requestUrl);

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    test('Utilizando um bank code válido: 260', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/260`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(validOutputSchema);

      expect(response.data.ispb).toBe('18236120');
      expect(response.data.name).toContain('NU PAGAMENTOS');
      expect(response.data.code).toBe(260);
      expect(response.data.fullName).toContain('NU PAGAMENTOS');
    });

    test('Utilizando um bank code válido (com vírgula no nome): 402', async () => {
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/402`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(validOutputSchema);

      expect(response.data.ispb).toBe('36947229');
      expect(response.data.name).toContain('COBUCCIO');
      expect(response.data.code).toBe(402);
      expect(response.data.fullName).toContain('COBUCCIO');
    });

    test('Utilizando um código inexistente: 1111111', async () => {
      expect.assertions(2);
      const requestUrl = `${global.SERVER_URL}/api/banks/v1/1111111`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Código bancário não encontrado',
          type: 'BANK_CODE_NOT_FOUND',
        });
      }
    });
  });

  test('GET /banks/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/banks/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
