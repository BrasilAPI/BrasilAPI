import { describe, expect, it, vi } from 'vitest';
import httpClient from '@/lib/http/client';
import { listElectionYears } from '@/services/eleicoes';

vi.mock('@/lib/http/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Anos Eleitorais Válidos', () => {
  it('deve retornar um array de anos eleitorais', async () => {
    const mockResponse = [
      2024, 2022, 2020, 2018, 2016, 2014, 2012, 2010, 2008, 2006, 2004,
    ];

    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockResponse });

    const response = await listElectionYears();

    expect(response).toEqual(mockResponse);
  });
});
