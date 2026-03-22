import axios from 'axios';
import { describe, test, expect, beforeAll } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

const DRAW_SHAPE = {
  numero: expect.any(Number),
  dataApuracao: expect.any(String),
  listaDezenas: expect.any(Array),
};

describe('/loterias/v1 - Último resultado (E2E)', () => {
  let baseUrl;

  beforeAll(() => {
    baseUrl = `${global.SERVER_URL}/api/loterias/v1`;
  });

  test('Retorna resultado da megasena com estrutura válida', async () => {
    expect.assertions(1);
    const { data } = await axios.get(`${baseUrl}/megasena`);
    expect(data).toMatchObject(DRAW_SHAPE);
  });

  test('Retorna resultado da quina com estrutura válida', async () => {
    expect.assertions(1);
    const { data } = await axios.get(`${baseUrl}/quina`);
    expect(data).toMatchObject(DRAW_SHAPE);
  });

  test('Retorna resultado da lotofacil com estrutura válida', async () => {
    expect.assertions(1);
    const { data } = await axios.get(`${baseUrl}/lotofacil`);
    expect(data).toMatchObject(DRAW_SHAPE);
  });

  test('Retorna 400 para loteria inválida', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/invalida`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ type: 'lottery_error' });
    }
  });
});

describe('/loterias/v1 - Resultado por concurso (E2E)', () => {
  let baseUrl;

  beforeAll(() => {
    baseUrl = `${global.SERVER_URL}/api/loterias/v1`;
  });

  test('Retorna resultado do concurso 1 da megasena', async () => {
    expect.assertions(2);
    const { data } = await axios.get(`${baseUrl}/megasena/1`);
    expect(data).toMatchObject(DRAW_SHAPE);
    expect(data.numero).toBe(1);
  });

  test('Retorna resultado do concurso 100 da lotofacil', async () => {
    expect.assertions(2);
    const { data } = await axios.get(`${baseUrl}/lotofacil/100`);
    expect(data).toMatchObject(DRAW_SHAPE);
    expect(data.numero).toBe(100);
  });

  test('Retorna resultado do concurso 500 da quina', async () => {
    expect.assertions(2);
    const { data } = await axios.get(`${baseUrl}/quina/500`);
    expect(data).toMatchObject(DRAW_SHAPE);
    expect(data.numero).toBe(500);
  });

  test('Retorna 400 para concurso 0', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/megasena/0`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ type: 'lottery_error' });
    }
  });

  test('Retorna 400 para concurso negativo', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/megasena/-1`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ type: 'lottery_error' });
    }
  });

  test('Retorna 400 para concurso não numérico', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/megasena/abc`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ type: 'lottery_error' });
    }
  });

  test('Retorna 400 para loteria inválida com concurso válido', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/invalida/1`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ type: 'lottery_error' });
    }
  });

  test('Retorna 404 para concurso inexistente (9999999)', async () => {
    expect.assertions(1);
    try {
      await axios.get(`${baseUrl}/megasena/9999999`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});

describe('/loterias/v1 - Mega da Virada por ano (E2E)', () => {
  let baseUrl;

  beforeAll(() => {
    baseUrl = `${global.SERVER_URL}/api/loterias/v1/megasena/virada`;
  });

  test('Retorna Mega da Virada de 2024 com data 31/12/2024', async () => {
    expect.assertions(2);
    const { data } = await axios.get(`${baseUrl}/2024`);
    expect(data).toMatchObject(DRAW_SHAPE);
    expect(data.dataApuracao).toBe('31/12/2024');
  });

  test('Retorna Mega da Virada de 2023 com data 31/12/2023', async () => {
    expect.assertions(2);
    const { data } = await axios.get(`${baseUrl}/2023`);
    expect(data).toMatchObject(DRAW_SHAPE);
    expect(data.dataApuracao).toBe('31/12/2023');
  });

  test('Retorna Mega da Virada de 2025 com data 31/12/2025', async () => {
    expect.assertions(2);
    const { data } = await axios.get(`${baseUrl}/2025`);
    expect(data).toMatchObject(DRAW_SHAPE);
    expect(data.dataApuracao).toBe('31/12/2025');
  });

  test('Retorna 400 para ano 1995 (anterior ao mínimo de 1996)', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/1995`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ type: 'lottery_error' });
    }
  });

  test('Retorna 400 para ano 9999 (muito além do futuro)', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/9999`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ type: 'lottery_error' });
    }
  });

  test('Retorna 400 para ano não numérico', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/abc`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({ type: 'lottery_error' });
    }
  });

  test('Retorna 404 para ano 1996 (Mega da Virada só existe a partir de 2009)', async () => {
    expect.assertions(1);
    try {
      await axios.get(`${baseUrl}/1996`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});

describe('/loterias/v1 - Mega da Virada do ano corrente (E2E)', () => {
  let baseUrl;

  beforeAll(() => {
    baseUrl = `${global.SERVER_URL}/api/loterias/v1/megasena/virada`;
  });

  test('Não retorna erro 500 ao consultar a Mega da Virada do ano corrente', async () => {
    expect.assertions(1);
    try {
      const { status } = await axios.get(baseUrl);
      expect([200, 404]).toContain(status);
    } catch (error) {
      expect(error.response.status).not.toBe(500);
    }
  });
});

testCorsForRoute('/api/loterias/v1/megasena');
testCorsForRoute('/api/loterias/v1/megasena/1');
testCorsForRoute('/api/loterias/v1/megasena/virada/2024');
