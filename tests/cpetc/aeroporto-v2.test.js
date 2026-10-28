import axios from 'axios';
import { describe, expect, test } from 'vitest';

const route = '/api/cptec/v2/clima/aeroporto';

describe('weather airport v2 (E2E)', () => {
  test.each(['SB', '1234', 'SB!R'])(
    'retorna 400 para um código ICAO inválido (%s)',
    async (code) => {
      const response = await axios.get(
        `${global.SERVER_URL}${route}/${encodeURIComponent(code)}`,
        { validateStatus: () => true }
      );

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'INVALID_ICAO_CODE',
        type: 'request_error',
        message: 'Código ICAO inválido, informe 4 letras',
      });
      expect(response.headers['access-control-allow-origin']).toBe('*');
    }
  );

  test('retorna 404 para um aeroporto sem condições disponíveis', async () => {
    const response = await axios.get(`${global.SERVER_URL}${route}/ZZZZ`, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
    expect(response.data).toEqual({
      name: 'AIRPORT_CONDITIONS_NOT_FOUND',
      type: 'weather_error',
      message: 'Condições meteorológicas ou aeroporto não localizados',
    });
  });

  test('retorna condições válidas ou informa ausência de observações para SBGR', async () => {
    const response = await axios.get(`${global.SERVER_URL}${route}/SBGR`, {
      validateStatus: () => true,
    });

    // O CPTEC pode retornar placeholders para um aeroporto existente.
    expect([200, 404]).toContain(response.status);
    expect(response.headers['access-control-allow-origin']).toBe('*');
    if (response.status === 200) {
      expect(response.data).toMatchObject({
        codigo_icao: 'SBGR',
        atualizado_em: expect.any(String),
      });
      expect(Number.isNaN(Date.parse(response.data.atualizado_em))).toBe(false);
      expect(
        new Date(response.data.atualizado_em).getUTCFullYear()
      ).toBeGreaterThan(0);
    } else {
      expect(response.data).toEqual({
        name: 'AIRPORT_CONDITIONS_NOT_FOUND',
        type: 'weather_error',
        message: 'Condições meteorológicas ou aeroporto não localizados',
      });
    }
  });

  test('responde ao preflight CORS sem consultar o provedor', async () => {
    const response = await axios.options(`${global.SERVER_URL}${route}/SBGR`, {
      headers: {
        Origin: 'https://example.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-methods']).toContain('GET');
    expect(response.headers['access-control-allow-headers']).toContain(
      'Content-Type'
    );
    expect(response.headers['access-control-allow-headers']).toContain(
      'Authorization'
    );
  });
});
