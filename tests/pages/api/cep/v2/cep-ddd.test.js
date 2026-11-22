import { beforeEach, describe, expect, test, vi } from 'vitest';

import { fetchCep } from '@/services/cep/cep';
import { getDddsData } from '@/services/ddd';
import fetchGeocoordinateFromBrazilLocation from '@/lib/fetchGeocoordinateFromBrazilLocation';
import fetchTimezoneNameFromBrazilLocation from '@/lib/fetchTimezoneNameFromBrazilLocation';
import handler from '@/pages/api/cep/v2/[cep]';

// `app()` devolve o próprio handler: testa a rota real sem servidor/middlewares.
vi.mock('@/app', () => ({ default: () => ({ get: (fn) => fn }) }));
vi.mock('@/services/cep/cep', () => ({ fetchCep: vi.fn() }));
vi.mock('@/services/ddd', async (importOriginal) => ({
  ...(await importOriginal()),
  getDddsData: vi.fn(),
}));
vi.mock('@/lib/fetchGeocoordinateFromBrazilLocation', () => ({
  default: vi.fn(),
}));
vi.mock('@/lib/fetchTimezoneNameFromBrazilLocation', () => ({
  default: vi.fn(),
}));

const CEP = {
  cep: '05010000',
  state: 'SP',
  city: 'São Paulo',
  neighborhood: 'Perdizes',
  street: 'Rua Caiubi',
  service: 'open-cep',
  ibge: { city: '3550308', state: '35' },
};

const LOCATION = {
  type: 'Point',
  coordinates: { longitude: '-46.67', latitude: '-23.53' },
};

const DDDS_DATA = [
  { ibgeCode: '3550308', state: 'SP', city: 'SÃO PAULO', ddd: '11' },
  { ibgeCode: '4202404', state: 'SC', city: 'BLUMENAU', ddd: '47' },
];

class CepPromiseError extends Error {
  constructor(type) {
    super('erro');
    this.name = 'CepPromiseError';
    this.type = type;
    this.errors = [];
  }
}

function createResponse() {
  const response = {
    statusCode: undefined,
    body: undefined,
    setHeader: vi.fn(),
    status: vi.fn((code) => {
      response.statusCode = code;
      return response;
    }),
    json: vi.fn((body) => {
      response.body = body;
      return response;
    }),
  };
  return response;
}

async function callRoute(query) {
  const response = createResponse();
  await handler({ query: { cep: '05010000', ...query } }, response);
  return response;
}

describe('CEP v2 handler — parâmetro ddd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCep.mockImplementation(async () => ({
      ...CEP,
      ibge: { ...CEP.ibge },
    }));
    fetchGeocoordinateFromBrazilLocation.mockResolvedValue(LOCATION);
    fetchTimezoneNameFromBrazilLocation.mockResolvedValue('America/Sao_Paulo');
    getDddsData.mockResolvedValue(DDDS_DATA);
  });

  test('sem o parâmetro mantém a resposta atual e não consulta a Anatel', async () => {
    const response = await callRoute({});

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ...CEP,
      timezoneName: 'America/Sao_Paulo',
      location: LOCATION,
    });
    expect(response.body).not.toHaveProperty('ddd');
    expect(getDddsData).not.toHaveBeenCalled();
  });

  test.each([
    ['false', 'false'],
    ['foo', 'foo'],
    ['vazio', ''],
    ['repetido (?ddd=true&ddd=true)', ['true', 'true']],
  ])('ddd %s equivale a falso e não consulta a Anatel', async (_, ddd) => {
    const response = await callRoute({ ddd });

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty('ddd');
    expect(getDddsData).not.toHaveBeenCalled();
  });

  test.each(['true', 'TRUE', 'True'])(
    'ddd=%s inclui o DDD como string de dois dígitos',
    async (ddd) => {
      const response = await callRoute({ ddd });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        ...CEP,
        timezoneName: 'America/Sao_Paulo',
        location: LOCATION,
        ddd: '11',
      });
      expect(getDddsData).toHaveBeenCalledTimes(1);
    }
  );

  test('sem código IBGE usa UF + nome do município', async () => {
    fetchCep.mockResolvedValue({
      ...CEP,
      cep: '89010025',
      state: 'SC',
      city: 'Blumenau',
      ibge: { city: null, state: '42' },
    });

    const response = await callRoute({ ddd: 'true' });

    expect(response.body.ddd).toBe('47');
  });

  test('município sem associação retorna ddd: null', async () => {
    fetchCep.mockResolvedValue({
      ...CEP,
      city: 'Cidade Inexistente',
      ibge: { city: '9999999', state: '35' },
    });

    const response = await callRoute({ ddd: 'true' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('ddd', null);
  });

  test('falha ou timeout da Anatel retorna ddd: null sem impedir o CEP', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    getDddsData.mockRejectedValue(
      Object.assign(new Error('timeout of 3000ms exceeded'), {
        code: 'ECONNABORTED',
      })
    );

    const response = await callRoute({ ddd: 'true' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      cep: '05010000',
      timezoneName: 'America/Sao_Paulo',
      location: LOCATION,
      ddd: null,
    });
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  test('a consulta à Anatel ocorre só depois do CEP encontrado', async () => {
    let cepResolved = false;
    fetchCep.mockImplementation(async () => {
      expect(getDddsData).not.toHaveBeenCalled();
      cepResolved = true;
      return { ...CEP, ibge: { ...CEP.ibge } };
    });
    getDddsData.mockImplementation(async () => {
      expect(cepResolved).toBe(true);
      return DDDS_DATA;
    });

    const response = await callRoute({ ddd: 'true' });

    expect(response.body.ddd).toBe('11');
  });

  test.each([
    ['inválido', 'validation_error', 400],
    ['inexistente', 'service_error', 404],
  ])(
    'CEP %s com ddd=true mantém o erro e não consulta a Anatel',
    async (_, type, status) => {
      fetchCep.mockRejectedValue(new CepPromiseError(type));

      const response = await callRoute({ ddd: 'true' });

      expect(response.statusCode).toBe(status);
      expect(response.body).toMatchObject({ name: 'CepPromiseError', type });
      expect(response.body).not.toHaveProperty('ddd');
      expect(getDddsData).not.toHaveBeenCalled();
    }
  );
});
