import { describe, expect, it, vi, beforeEach } from 'vitest';
import PositionsByMunicipality from '@/pages/api/eleicoes/cargos-por-municipio';
import httpClient from '@/lib/http/client';

vi.mock('@/lib/http/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('API handler /api/eleicoes/cargos-por-municipio', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve retornar a lista de cargos do município', async () => {
    const mockResponse = {
      unidadeEleitoralDTO: {
        id: null,
        sigla: 'BA',
        nome: 'FEIRA DE SANTANA',
        regiao: null,
        cargos: null,
        diretorios: null,
        codigo: '35157',
        capital: false,
        estado: 'BAHIA',
      },
      cargos: [
        {
          codigo: 11,
          sigla: null,
          nome: 'Prefeito',
          codSuperior: 0,
          titular: false,
          contagem: 11,
        },
        {
          codigo: 12,
          sigla: null,
          nome: 'Vice-prefeito',
          codSuperior: 0,
          titular: false,
          contagem: 12,
        },
        {
          codigo: 13,
          sigla: null,
          nome: 'Vereador',
          codSuperior: 0,
          titular: false,
          contagem: 695,
        },
      ],
    };

    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockResponse });

    const req = {
      query: {
        election: '2030402020',
        municipality: '35157',
      },
      headers: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await PositionsByMunicipality(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
    expect(httpClient.get).toHaveBeenCalled();
  });
});
