import { afterEach, describe, expect, test, vi } from 'vitest';

import fetchGeocoordinateFromBrazilLocation from '@/lib/fetchGeocoordinateFromBrazilLocation';

function createFetchResponse(data, ok = true) {
  return {
    ok,
    json: vi.fn().mockResolvedValue(data),
  };
}

const photonFeature = (postcode, coords) => ({
  geometry: { coordinates: coords },
  properties: { postcode },
});

describe('fetchGeocoordinateFromBrazilLocation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('faz fallback sem logradouro quando a busca inicial nao encontra resultado', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(createFetchResponse({ features: [] }))
      .mockResolvedValueOnce(
        createFetchResponse({
          features: [photonFeature('05010-000', [-46.633308, -23.55052])],
        })
      )
      .mockResolvedValueOnce(createFetchResponse({ results: [] }));

    const location = await fetchGeocoordinateFromBrazilLocation({
      state: 'SP',
      city: 'Sao Paulo',
      street: 'Rua Caiubi',
      cep: '05010-000',
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][0]).toContain('q=');
    expect(fetchMock.mock.calls[0][0]).toContain('Rua+Caiubi');
    expect(fetchMock.mock.calls[0][0]).toContain('05010000');
    expect(fetchMock.mock.calls[1][0]).not.toContain('Rua+Caiubi');
    expect(fetchMock.mock.calls[1][0]).toContain('05010000');
    expect(fetchMock.mock.calls[2][0]).toContain('name=');
    expect(location).toEqual({
      type: 'Point',
      coordinates: {
        longitude: '-46.633308',
        latitude: '-23.55052',
      },
    });
  });

  test('retorna coordenada indisponivel quando o provider responde sem features', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      createFetchResponse({ message: 'rate limit' })
    );

    const location = await fetchGeocoordinateFromBrazilLocation({
      state: 'SP',
      city: 'Sao Paulo',
      street: 'Rua Caiubi',
      cep: '05010-000',
    });

    expect(location).toEqual({
      type: 'Point',
      coordinates: {
        longitude: null,
        latitude: null,
      },
    });
  });

  test('retorna coordenada indisponivel quando nenhuma tentativa encontra resultado', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      createFetchResponse({ features: [] })
    );

    const location = await fetchGeocoordinateFromBrazilLocation({
      state: 'SP',
      city: 'Sao Paulo',
      street: 'Rua Caiubi',
      cep: '05010-000',
    });

    expect(location).toEqual({
      type: 'Point',
      coordinates: {
        longitude: null,
        latitude: null,
      },
    });
  });
});
