import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('weather airport v1 (E2E)', () => {
  test('GET /api/cptec/v1/clima/aeroporto/:icaoCode (Código inexistente)', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/aeroporto/AAAA`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        message: 'Condições meteorológicas ou aeroporto não localizados',
        type: 'weather_error',
        name: 'AIRPORT_CONDITIONS_NOT_FOUND',
      });
    }
  });

  test('GET /api/cptec/v1/clima/aeroporto/:icaoCode', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/aeroporto/SBSP`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(false);

    expect(response.data).toMatchObject({
      codigo_icao: 'SBSP',
    });
  });
});
