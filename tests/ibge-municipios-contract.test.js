import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import getMunicipios from '@/pages/api/ibge/municipios/v1/[uf]';
import { getCities } from '@/services/dados-abertos-br/cities';
import { getContiesByUf } from '@/services/ibge/gov';
import { getStateCities } from '@/services/ibge/wikipedia';

vi.mock('@/app', () => ({
  default: () => ({ get: (handler) => handler }),
}));
vi.mock('@/services/dados-abertos-br/cities', () => ({ getCities: vi.fn() }));
vi.mock('@/services/ibge/gov', () => ({ getContiesByUf: vi.fn() }));
vi.mock('@/services/ibge/wikipedia', async (importOriginal) => ({
  ...(await importOriginal()),
  getStateCities: vi.fn(),
}));

const timeoutError = () =>
  Object.assign(new Error('timeout of 4000ms exceeded'), {
    code: 'ECONNABORTED',
  });

const wikipediaCities = [
  { nome: 'Recife', codigo_ibge: '2611606' },
  { nome: 'Abreu e Lima', codigo_ibge: '2600054' },
];

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  getCities.mockRejectedValue(timeoutError());
  getContiesByUf.mockRejectedValue(timeoutError());
  getStateCities.mockResolvedValue(wikipediaCities);
});

describe('/ibge/municipios/v1 quando os providers padrão falham', () => {
  test('usa a Wikipedia como fallback e responde 200', async () => {
    const response = createResponse();

    await getMunicipios({ query: { uf: 'PE' } }, response);

    expect(getStateCities).toHaveBeenCalledWith('PE');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([
      { nome: 'ABREU E LIMA', codigo_ibge: '2600054' },
      { nome: 'RECIFE', codigo_ibge: '2611606' },
    ]);
  });

  test('não chama a Wikipedia quando um provider padrão responde', async () => {
    getContiesByUf.mockResolvedValue([
      { nome: 'Recife', codigo_ibge: '2611606' },
    ]);
    const response = createResponse();

    await getMunicipios({ query: { uf: 'PE' } }, response);

    expect(getStateCities).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test('responde 500 em JSON quando o fallback também falha', async () => {
    getStateCities.mockRejectedValue(new Error('wikipedia fora do ar'));

    await expect(
      getMunicipios({ query: { uf: 'PE' } }, createResponse())
    ).rejects.toMatchObject({ status: 500, name: 'EstadoInternalException' });
  });

  test('responde 500 em JSON quando o fallback não responde a tempo', async () => {
    getStateCities.mockReturnValue(new Promise(() => {}));
    const start = Date.now();

    await expect(
      getMunicipios({ query: { uf: 'PE' } }, createResponse())
    ).rejects.toMatchObject({ status: 500, name: 'EstadoInternalException' });
    expect(Date.now() - start).toBeLessThan(5000);
  });

  test('não usa fallback quando o cliente escolhe os providers', async () => {
    await expect(
      getMunicipios({ query: { uf: 'PE', providers: 'gov' } }, createResponse())
    ).rejects.toMatchObject({ status: 500 });

    expect(getStateCities).not.toHaveBeenCalled();
  });
});

describe('timeout das chamadas aos providers', () => {
  test.each([
    [
      'dados-abertos-br',
      '@/services/dados-abertos-br/cities',
      'getCities',
      ['PE'],
    ],
    ['gov', '@/services/ibge/gov', 'getContiesByUf', ['PE']],
  ])('%s passa timeout ao axios', async (_, path, fn, args) => {
    const service = await vi.importActual(path);
    const spy = vi.spyOn(axios, 'get').mockResolvedValue({ data: [] });

    await service[fn](...args);

    expect(spy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ timeout: 4000 })
    );
    spy.mockRestore();
  });
});
