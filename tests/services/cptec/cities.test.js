import { beforeEach, describe, expect, test, vi } from 'vitest';
import axios from 'axios';
import ServiceUnavailableError from '@/errors/ServiceUnavailableError';
import { getCityData } from '@/services/cptec/cities';

vi.mock('axios');

describe('getCityData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('retorna as cidades encontradas no CPTEC', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: '<cidades><cidade><nome>Brasilia</nome><uf>DF</uf><id>61</id></cidade></cidades>',
    });

    await expect(getCityData('Brasilia')).resolves.toEqual([
      {
        nome: 'Brasilia',
        id: 61,
        estado: 'DF',
        regiao: 'Centro-Oeste',
      },
    ]);
  });

  test('retorna erro 503 quando o serviço do CPTEC está indisponível', async () => {
    const upstreamError = new Error('Request failed with status code 403');

    vi.mocked(axios.get).mockRejectedValue(upstreamError);
    vi.mocked(axios.isAxiosError).mockReturnValue(true);

    const request = getCityData('Brasilia');

    await expect(request).rejects.toMatchObject({
      status: 503,
      message: 'Serviço CPTEC temporariamente indisponível',
      type: 'city_error',
      name: 'CPTEC_SERVICE_UNAVAILABLE',
    });
    await expect(request).rejects.toBeInstanceOf(ServiceUnavailableError);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('preserva erros que não foram gerados pelo cliente HTTP', async () => {
    const unexpectedError = new Error('Unexpected error');

    vi.mocked(axios.get).mockRejectedValue(unexpectedError);
    vi.mocked(axios.isAxiosError).mockReturnValue(false);

    await expect(getCityData('Brasilia')).rejects.toBe(unexpectedError);
  });
});
