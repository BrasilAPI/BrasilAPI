import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  clearReferenceTablesCache,
  getLatestReferenceTable,
  listReferenceTables,
} from '@/services/fipe/referenceTable';

vi.mock('axios');

describe('services/fipe/referenceTable', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    clearReferenceTablesCache();
  });

  test('retorna tabelas da fonte oficial ordenadas de forma decrescente', async () => {
    axios.post.mockResolvedValueOnce({
      data: [
        { Codigo: 338, Mes: 'outubro/2026 ' },
        { Codigo: 339, Mes: 'novembro/2026 ' },
      ],
    });

    const tables = await listReferenceTables();

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.get).not.toHaveBeenCalled();
    expect(tables).toEqual([
      { codigo: 339, mes: 'novembro/2026 ' },
      { codigo: 338, mes: 'outubro/2026 ' },
    ]);
  });

  test('usa fallback Parallelum v2 quando a fonte oficial retorna 403', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 403 } });
    axios.get.mockResolvedValueOnce({
      data: [
        { code: '338', month: 'outubro/2026' },
        { code: '339', month: 'novembro/2026' },
      ],
    });

    const tables = await listReferenceTables();

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://parallelum.com.br/fipe/api/v2/references',
      { timeout: 10000 }
    );
    expect(tables).toEqual([
      { codigo: 339, mes: 'novembro/2026' },
      { codigo: 338, mes: 'outubro/2026' },
    ]);
  });

  test('usa fallback Parallelum v2 quando a fonte oficial retorna desafio Cloudflare', async () => {
    axios.post.mockResolvedValueOnce({
      data: '<html><script>window["cf-chl-opt"]={}</script></html>',
    });
    axios.get.mockResolvedValueOnce({
      data: [{ code: '339', month: 'novembro/2026' }],
    });

    const latest = await getLatestReferenceTable();

    expect(latest).toBe(339);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('reutiliza cache em memória e deduplica chamadas concorrentes', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 403 } });
    axios.get.mockResolvedValueOnce({
      data: [{ code: '339', month: 'novembro/2026' }],
    });

    const [first, second] = await Promise.all([
      listReferenceTables(),
      listReferenceTables(),
    ]);
    const third = await listReferenceTables();

    expect(first).toEqual([{ codigo: 339, mes: 'novembro/2026' }]);
    expect(second).toEqual(first);
    expect(third).toEqual(first);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('lança mensagem amigável quando oficial e fallback falham sem poluir o cache', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 403 } });
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(listReferenceTables()).rejects.toThrow(
      'Fonte de dados FIPE temporariamente indisponível. Tente novamente mais tarde.'
    );

    axios.post.mockResolvedValueOnce({
      data: [{ Codigo: 339, Mes: 'novembro/2026 ' }],
    });

    await expect(listReferenceTables()).resolves.toEqual([
      { codigo: 339, mes: 'novembro/2026 ' },
    ]);
  });

  test('getLatestReferenceTable retorna undefined quando ambas as fontes falham', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 500 } });
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    await expect(getLatestReferenceTable()).resolves.toBeUndefined();
  });
});
