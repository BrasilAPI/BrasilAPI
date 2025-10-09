import axios from 'axios';
import { beforeAll, describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('api/tuss/v1 (E2E)', () => {
  let baseUrl = '';

  beforeAll(async () => {
    baseUrl = `${global.SERVER_URL}/api/tuss/v1`;
  });

  test('Lista completa sem filtros', async () => {
    const response = await axios.get(baseUrl);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        limit: null,
        offset: 0,
        items: expect.any(Array),
      })
    );
    expect(data.items.length).toBeGreaterThan(0);
    const first = data.items[0];
    expect(first).toEqual(
      expect.objectContaining({ tuss: expect.any(String), name: expect.any(String) })
    );
    // Sem paginação, total deve ser igual ao tamanho de items
    expect(data.total).toEqual(data.items.length);
  });

  test('Filtro por name retorna somente correspondências', async () => {
    const response = await axios.get(`${baseUrl}?name=Consulta`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThan(0);
    data.items.forEach((item) => {
      expect(item.name.toLowerCase()).toContain('consulta');
    });
  });

  test('Detalhe por código válido: 10101012', async () => {
    const response = await axios.get(`${baseUrl}/10101012`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({ tuss: '10101012', name: expect.stringContaining('Consulta') })
    );
  });

  test('Detalhe por código inexistente retorna 404', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${baseUrl}/000`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        message: 'Código TUSS não encontrado',
        type: 'TUSS_CODE_NOT_FOUND',
      });
    }
  });
});

describe('api/tuss/v1/search (E2E)', () => {
  let searchUrl = '';
  beforeAll(async () => {
    searchUrl = `${global.SERVER_URL}/api/tuss/v1/search`;
  });

  test('Busca avançada por tokens (q) encontra código conhecido', async () => {
    const response = await axios.get(`${searchUrl}?q=Consulta%20pronto`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        items: expect.any(Array),
      })
    );
    // Deve conter o termo "Consulta em pronto socorro" (tuss 10101039)
    const found = data.items.some((item) => item.tuss === '10101039');
    expect(found).toBe(true);
  });

  test('Project de campos retorna apenas tuss e name', async () => {
    const response = await axios.get(`${searchUrl}?q=Consulta&fields=tuss,name&limit=5`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThan(0);
    data.items.forEach((item) => {
      expect(Object.keys(item).sort()).toEqual(['name', 'tuss']);
    });
  });

  test('Paginação com limit e offset', async () => {
    const first = await axios.get(`${searchUrl}?q=Consulta&limit=3&offset=0`);
    const next = await axios.get(`${searchUrl}?q=Consulta&limit=3&offset=3`);

    expect(first.data.limit).toBe(3);
    expect(next.data.limit).toBe(3);
    expect(first.data.items.length).toBeLessThanOrEqual(3);
    expect(next.data.items.length).toBeLessThanOrEqual(3);
    // Itens devem mudar com o offset
    if (first.data.items.length > 0 && next.data.items.length > 0) {
      expect(first.data.items[0]).not.toEqual(next.data.items[0]);
    }
  });
});

describe('api/tuss/v1/autocomplete (E2E)', () => {
  let autoUrl = '';
  beforeAll(async () => {
    autoUrl = `${global.SERVER_URL}/api/tuss/v1/autocomplete`;
  });

  test('Autocomplete prefixa por código', async () => {
    const response = await axios.get(`${autoUrl}?q=1010`);
    const { data, status } = response;
    expect(status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toEqual(
      expect.objectContaining({ tuss: expect.stringMatching(/^1010/), name: expect.any(String) })
    );
  });

  test('Limite padrão e teto de 20', async () => {
    const def = await axios.get(`${autoUrl}?q=1010`);
    const capped = await axios.get(`${autoUrl}?q=1010&limit=50`);
    const small = await axios.get(`${autoUrl}?q=1010&limit=5`);

    expect(def.data.length).toBeLessThanOrEqual(10);
    expect(capped.data.length).toBeLessThanOrEqual(20);
    expect(small.data.length).toBeLessThanOrEqual(5);
  });
});

// CORS
testCorsForRoute('/api/tuss/v1');
testCorsForRoute('/api/tuss/v1/10101012');
testCorsForRoute('/api/tuss/v1/search?q=Consulta');
testCorsForRoute('/api/tuss/v1/autocomplete?q=1010');