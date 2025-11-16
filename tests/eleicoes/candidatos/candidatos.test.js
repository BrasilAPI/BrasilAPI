import axios from 'axios';
import {
  listCandidatureByMunicipality,
  searchCandidate,
} from '@/services/eleicoes/candidaturas';
import { describe, expect, it, vi } from 'vitest';
import { ERRORMESSAGES } from '@/services/eleicoes/constants';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Listagem de Candidaturas', () => {
  it('deve retornar a lista de candidaturas do município', async () => {
    const mockResponse = {
      unidadeEleitoral: {
        nome: 'Feira de Santana',
        siglaUf: 'BA',
        codigo: 35157,
      },
      cargo: { codigo: '11', nome: 'Prefeito' },
      candidatos: [{ nomeUrna: 'Zé Neto', numero: 13 }],
      service: 'mock-service',
    };

    axios.get.mockResolvedValueOnce({ data: mockResponse });

    const resultado = await listCandidatureByMunicipality(
      '2030402020',
      2020,
      '35157',
      '11'
    );

    expect(resultado).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalled();
  });

  it('deve lançar erro quando eleição está ausente em listarCandidaturasMunicipio', async () => {
    await expect(
      listCandidatureByMunicipality(null, 2020, '35157', '11')
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando ano está ausente em listarCandidaturasMunicipio', async () => {
    await expect(
      listCandidatureByMunicipality('2030402020', null, '35157', '11')
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando município está ausente em listarCandidaturasMunicipio', async () => {
    await expect(
      listCandidatureByMunicipality('2030402020', 2020, null, '11')
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando posição está ausente em listarCandidaturasMunicipio', async () => {
    await expect(
      listCandidatureByMunicipality('2030402020', 2020, '35157', null)
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando ano tem formato inválido em listarCandidaturasMunicipio', async () => {
    await expect(
      listCandidatureByMunicipality('2030402020', 'abc', '35157', '11')
    ).rejects.toThrow(ERRORMESSAGES.INVALID_YEAR);
  });

  it('deve lançar erro quando ano tem menos de 4 dígitos em listarCandidaturasMunicipio', async () => {
    await expect(
      listCandidatureByMunicipality('2030402020', 202, '35157', '11')
    ).rejects.toThrow(ERRORMESSAGES.INVALID_YEAR);
  });

  it('deve lançar erro quando município tem tipo inválido em listarCandidaturasMunicipio', async () => {
    await expect(
      listCandidatureByMunicipality('2030402020', 2020, {}, '11')
    ).rejects.toThrow(ERRORMESSAGES.INVALID_MUNICIPALITY);
  });

  it('deve lançar erro quando posição tem tipo inválido em listarCandidaturasMunicipio', async () => {
    await expect(
      listCandidatureByMunicipality('2030402020', 2020, '35157', {})
    ).rejects.toThrow(ERRORMESSAGES.INVALID_POSITION);
  });

  it('deve retornar o candidato buscado', async () => {
    const mockResponse = {
      id: 50000867342,
      nomeUrna: 'BETO TOURINHO',
      numero: 40,
      nomeCompleto: 'ROBERTO LUIS DA SILVA TOURINHO',
      descricaoSexo: 'MASC.',
      dataDeNascimento: '1964-09-14',
      tituloEleitor: '001564180582',
      cpf: null,
      descricaoEstadoCivil: 'Casado(a)',
      descricaoCorRaca: 'BRANCA',
      descricaoSituacao: 'Deferido',
      nacionalidade: 'Brasileira nata',
      grauInstrucao: 'Superior completo',
      ocupacao: 'Vereador',
      gastoCampanha1T: 1808167.86,
      gastoCampanha2T: 723267.14,
      sgUfNascimento: 'BA',
      nomeMunicipioNascimento: 'SALVADOR',
      localCandidatura: 'FEIRA DE SANTANA',
      ufCandidatura: '35157',
      ufSuperiorCandidatura: 'BA',
      dataUltimaAtualizacao: '2024-10-24 10:12',
      fotoUrl:
        'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2030402020/50000867342/35157',
      fotoUrlPublicavel: true,
      descricaoTotalizacao: 'Não eleito',
      nomeColigacao: 'PSB',
      composicaoColigacao: '**',
      descricaoTipoDrap: 'Partido Isolado',
      cargo: {
        codigo: 11,
        sigla: null,
        nome: 'Prefeito',
        codSuperior: 0,
        titular: true,
        contagem: 0,
      },
      bens: [
        {
          ordem: 1,
          descricao:
            'Situada em Cond. Viva Mais - Vila Olimpia II, quadra H, casa 08.',
          descricaoDeTipoDeBem: 'Casa',
          valor: 130071.84,
          dataUltimaAtualizacao: '2020-09-23',
        },
      ],
      totalDeBens: 222325.35,
      partido: {
        numero: 40,
        sigla: 'PSB',
        nome: 'Partido Socialista Brasileiro',
        sqPrestadorConta: null,
      },
      eleicao: {
        id: 2030402020,
        siglaUF: null,
        ano: 2020,
        descricaoEleicao: '2020',
      },
      emails: null,
      sites: ['https://instagram - @betotourinhopsb'],
      arquivos: [],
      eleicoesAnteriores: [],
      codigoSituacaoCandidato: 2,
      descricaoSituacaoCandidato: 'Consta da urna',
      isCandidatoInapto: false,
      candidatoApto: false,
    };

    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockResponse,
    });

    const resultado = await searchCandidate(
      2030402020,
      2020,
      35157,
      50000867342
    );

    expect(resultado).toEqual(mockResponse);
  });

  // Testes de erro para buscarCandidato
  it('deve lançar erro quando eleição está ausente em buscarCandidato', async () => {
    await expect(
      searchCandidate(null, 2020, 35157, 50000867342)
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando ano está ausente em buscarCandidato', async () => {
    await expect(
      searchCandidate(2030402020, null, 35157, 50000867342)
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando município está ausente em buscarCandidato', async () => {
    await expect(
      searchCandidate(2030402020, 2020, null, 50000867342)
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando candidato está ausente em buscarCandidato', async () => {
    await expect(
      searchCandidate(2030402020, 2020, 35157, null)
    ).rejects.toThrow(ERRORMESSAGES.INVALID_PARAMETERS);
  });

  it('deve lançar erro quando ano tem formato inválido em buscarCandidato', async () => {
    await expect(
      searchCandidate(2030402020, 'abc', 35157, 50000867342)
    ).rejects.toThrow(ERRORMESSAGES.INVALID_YEAR);
  });

  it('deve lançar erro quando ano tem menos de 4 dígitos em buscarCandidato', async () => {
    await expect(
      searchCandidate(2030402020, 202, 35157, 50000867342)
    ).rejects.toThrow(ERRORMESSAGES.INVALID_YEAR);
  });
});
