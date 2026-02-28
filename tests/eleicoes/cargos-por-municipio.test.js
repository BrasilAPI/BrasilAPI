import { describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { listPositionsByMunicipality } from '@/services/eleicoes';
import { ERRORMESSAGES } from '@/services/eleicoes/constants';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Listagem de Cargos por Município', () => {
  it('Lista cargos para o municipio 35157', async () => {
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

    axios.get.mockResolvedValueOnce({ data: mockResponse });

    const resultado = await listPositionsByMunicipality('2030402020', '35157');

    expect(resultado).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalled();
  });

  it('deve lançar erro quando eleição está ausente', async () => {
    await expect(listPositionsByMunicipality(null, '35157')).rejects.toThrow(
      ERRORMESSAGES.INVALID_PARAMETERS
    );
  });

  it('deve lançar erro quando município está ausente', async () => {
    await expect(
      listPositionsByMunicipality('2030402020', null)
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando município tem tipo inválido', async () => {
    await expect(listPositionsByMunicipality('2030402020', {})).rejects.toThrow(
      ERRORMESSAGES.INVALID_MUNICIPALITY
    );
  });

  it('deve lançar erro quando eleição tem tipo inválido', async () => {
    await expect(listPositionsByMunicipality({}, '35157')).rejects.toThrow(
      ERRORMESSAGES.INVALID_ELECTION
    );
  });
});
