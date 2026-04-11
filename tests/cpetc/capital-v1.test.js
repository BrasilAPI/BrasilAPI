import axios from 'axios';
import { describe, expect, test } from 'vitest';

// O endpoint da CPTEC não está funcionando
describe.skip('weather capital v1 (E2E)', () => {
  test('GET /api/cptec/v1/clima/capital', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/capital`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);

    expect(response.data[0]).toMatchObject({
      codigo_icao: 'SBAR',
    });
  });
});
