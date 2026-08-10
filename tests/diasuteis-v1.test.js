import axios from 'axios';
import { describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('/diasuteis/v1 (E2E)', () => {
  test('Sem dataInicial/dataFinal: erro 400', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${global.SERVER_URL}/api/diasuteis/v1`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data.type).toBe('DATE_PARAM_MISSING');
    }
  });

  test('Agosto 2026 (dias úteis de segunda a sexta)', async () => {
    const requestUrl =
      `${global.SERVER_URL}/api/diasuteis/v1` +
      '?dataInicial=2026-08-03&dataFinal=2026-08-07';
    const { data } = await axios.get(requestUrl);

    expect(data.diasUteis).toEqual([
      '2026-08-03',
      '2026-08-04',
      '2026-08-05',
      '2026-08-06',
      '2026-08-07',
    ]);
  });

  test('Exclui feriado nacional (15/08 Assunção de Nossa Senhora é feriado, mas é sábado em 2026 — usar 07/09 Independência)', async () => {
    const requestUrl =
      `${global.SERVER_URL}/api/diasuteis/v1` +
      '?dataInicial=2026-09-07&dataFinal=2026-09-08';
    const { data } = await axios.get(requestUrl);

    // 07/09 é feriado nacional (Independência) → não entra; 08/09 entra
    expect(data.diasUteis).toEqual(['2026-09-08']);
  });

  test('incluirFeriadosNacionais=false: inclui feriado', async () => {
    const requestUrl =
      `${global.SERVER_URL}/api/diasuteis/v1` +
      '?dataInicial=2026-09-07&dataFinal=2026-09-08&incluirFeriadosNacionais=false';
    const { data } = await axios.get(requestUrl);

    expect(data.diasUteis).toEqual(['2026-09-07', '2026-09-08']);
  });
});

testCorsForRoute('/api/diasuteis/v1?dataInicial=2026-08-03&dataFinal=2026-08-07');
