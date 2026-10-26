import { describe, expect, it, vi, beforeEach } from 'vitest';
import AnosEleitorais from '@/pages/api/eleicoes/anos-eleitorais';
import httpClient from '@/lib/http/client';

vi.mock('@/lib/http/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('API handler /api/eleicoes/anos-eleitorais', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve retornar um array de anos eleitorais válidos', async () => {
    const mockResponse = [
      2024, 2022, 2020, 2018, 2016, 2014, 2012, 2010, 2008, 2006, 2004,
    ];

    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockResponse });

    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await AnosEleitorais(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/eleicao/anos-eleitorais'
    );
  });
});
