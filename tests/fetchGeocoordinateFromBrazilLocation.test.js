import { afterEach, describe, expect, test, vi } from 'vitest';

import fetchGeocoordinateFromBrazilLocation from '@/lib/fetchGeocoordinateFromBrazilLocation';
import httpClient from '@/lib/http/client';

vi.mock('@/lib/http/client', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

const photonFeature = (postcode, coords) => ({
  geometry: { coordinates: coords },
  properties: { postcode },
});

describe('fetchGeocoordinateFromBrazilLocation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('faz fallback sem logradouro quando a busca inicial nao encontra resultado', async () => {
    httpClient.get
      .mockResolvedValueOnce({ data: { features: [] } })
      .mockResolvedValueOnce({
        data: {
          features: [photonFeature('05010-000', [-46.633308, -23.55052])],
        },
      })
      .mockResolvedValueOnce({ data: { results: [] } });

    const location = await fetchGeocoordinateFromBrazilLocation({
      state: 'SP',
      city: 'Sao Paulo',
      street: 'Rua Caiubi',
      cep: '05010-000',
    });

    expect(httpClient.get).toHaveBeenCalledTimes(3);
    // First call: photon with full query (street + city + state + cep)
    expect(httpClient.get.mock.calls[0][0]).toBe('https://photon.komoot.io/api/');
    expect(httpClient.get.mock.calls[0][1].params.q).toContain('Rua Caiubi');
    expect(httpClient.get.mock.calls[0][1].params.q).toContain('05010000');
    // Second call: photon retry without street
    expect(httpClient.get.mock.calls[1][0]).toBe('https://photon.komoot.io/api/');
    expect(httpClient.get.mock.calls[1][1].params.q).not.toContain('Rua Caiubi');
    expect(httpClient.get.mock.calls[1][1].params.q).toContain('05010000');
    // Third call: open-meteo
    expect(httpClient.get.mock.calls[2][0]).toBe('https://geocoding-api.open-meteo.com/v1/search');
    expect(location).toEqual({
      type: 'Point',
      coordinates: {
        longitude: '-46.633308',
        latitude: '-23.55052',
      },
    });
  });

  test('retorna coordenada indisponivel quando o provider responde sem features', async () => {
    httpClient.get.mockResolvedValue(
      { data: { message: 'rate limit' } }
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
    httpClient.get.mockResolvedValue(
      { data: { features: [] } }
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
