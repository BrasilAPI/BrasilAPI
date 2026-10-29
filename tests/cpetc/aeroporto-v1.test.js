import axios from 'axios';
import { describe, expect, test } from 'vitest';

// Smart service availability check - skip only when DNS/network issues are detected
let shouldSkipTests = false;

try {
  const response = await axios.get(
    'https://servicos.cptec.inpe.br/XML/listaCidades?city=brasilia',
    {
      timeout: 5000,
    }
  );

  if (response.status !== 200) {
    shouldSkipTests = true;
  }
} catch (error) {
  shouldSkipTests = true;
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  CPTEC service unavailable (network/DNS issue) - skipping tests'
  );
}

describe.skipIf(shouldSkipTests)('weather airport v1 (E2E)', () => {
  test('GET /api/cptec/v1/clima/aeroporto/:icaoCode', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/aeroporto/SBSP`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(false);

    expect(response.data).toMatchObject({
      codigo_icao: 'SBSP',
    });
  });

  test('GET /api/cptec/v1/clima/aeroporto/:icaoCode (Código ICAO com tamanho inválido)', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/aeroporto/AAA`;

    await expect(axios.get(requestUrl)).rejects.toMatchObject({
      response: {
        status: 400,
        data: {
          message:
            'Código ICAO inválido, os códigos ICAO devem ter 4 caracteres',
          type: 'request_error',
          name: 'INVALID_ICAO_CODE',
        },
      },
    });
  });

  // Upstream CPTEC retorna HTTP 200 com campos literais 'undefined' para códigos ICAO sem observações (veja issue #703 e PR #937).
  // Na v1, o endpoint repassa o payload upstream para manter retrocompatibilidade.
  test.skip('GET /api/cptec/v1/clima/aeroporto/:icaoCode (Código inexistente)', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cptec/v1/clima/aeroporto/AAAA`;

    await expect(axios.get(requestUrl)).rejects.toMatchObject({
      response: {
        status: 404,
        data: {
          message: 'Condições meteorológicas ou aeroporto não localizados',
          type: 'weather_error',
          name: 'AIRPORT_CONDITIONS_NOT_FOUND',
        },
      },
    });
  });
});
