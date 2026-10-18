import { describe, expect, it, vi } from 'vitest';
import httpClient from '@/lib/http/client';
import OrdinaryElections from '@/pages/api/eleicoes/ordinarias';

vi.mock('@/lib/http/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('API handler /api/eleicoes/ordinarias', () => {
  it('deve retornar a lista de eleições ordinarias', async () => {
    const mockResponse = [
      {
        id: 2045202024,
        siglaUF: null,
        localidadeSgUe: null,
        ano: 2024,
        codigo: null,
        nomeEleicao: 'Eleições Municipais 2024',
        tipoEleicao: 'O',
        turno: null,
        tipoAbrangencia: 'M',
        dataEleicao: '2024-10-06',
        codSituacaoEleicao: null,
        descricaoSituacaoEleicao: null,
        descricaoEleicao: '2024',
      },
    ];

    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockResponse });

    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    await OrdinaryElections(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
    expect(httpClient.get).toHaveBeenCalled();
  });
});
