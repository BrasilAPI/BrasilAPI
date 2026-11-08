import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getIgpm } from '@/services/indices/igpm';
import { buildUrl, fetchData } from '@/services/indices/helpers';

vi.mock('@/services/indices/helpers', () => ({
  buildUrl: {
    simple: vi.fn(),
  },
  fetchData: vi.fn(),
}));

describe('services/indices/igpm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('informa a data inicial ao buscar toda a série do BCB', async () => {
    const url = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados';
    const code = 189;
    buildUrl.simple.mockReturnValue(url);
    fetchData.mockResolvedValue([
      {
        valor: '1,23',
        data: '01/06/1989',
      },
    ]);

    const result = await getIgpm(code);

    expect(fetchData).toHaveBeenCalledWith(url, expect.anything(), {
      dataInicial: '01/01/1900',
    });
    expect(result).toEqual([
      {
        value: 1.23,
        date: expect.stringMatching(/^1989-06-01T/),
      },
    ]);
  });
});
