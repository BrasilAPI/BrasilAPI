import axios from 'axios';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import Candidaturas from '@/pages/api/eleicoes/candidaturas/index';
import BuscarCandidato from '@/pages/api/eleicoes/candidaturas/[candidato]';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('API handler /api/eleicoes/candidaturas/v1 - in-process', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('deve responder 200 com a lista de candidaturas (invocação in-process)', async () => {
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

    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse });

    const req = {
      query: {
        election: '2030402020',
        year: '2020',
        municipality: '35157',
        position: '11',
      },
      headers: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await Candidaturas(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
    expect(axios.get).toHaveBeenCalled();
  });

  it('deve lançar erro quando eleição está ausente em Candidaturas', async () => {
    const req = {
      query: {
        election: null,
        year: '2020',
        municipality: '35157',
        position: '11',
      },
      headers: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(Candidaturas(req, res)).rejects.toThrow(
      'Parâmetros obrigatórios inválidos'
    );
  });

  it('deve lançar erro quando ano está ausente em Candidaturas', async () => {
    const req = {
      query: {
        election: '2030402020',
        year: null,
        municipality: '35157',
        position: '11',
      },
      headers: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(Candidaturas(req, res)).rejects.toThrow(
      'Parâmetros obrigatórios inválidos'
    );
  });

  it('deve lançar erro quando município está ausente em Candidaturas', async () => {
    const req = {
      query: {
        election: '2030402020',
        year: '2020',
        municipality: null,
        position: '11',
      },
      headers: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(Candidaturas(req, res)).rejects.toThrow(
      'Parâmetros obrigatórios inválidos'
    );
  });

  it('deve lançar erro quando posição está ausente em Candidaturas', async () => {
    const req = {
      query: {
        election: '2030402020',
        year: '2020',
        municipality: '35157',
        position: null,
      },
      headers: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(Candidaturas(req, res)).rejects.toThrow(
      'Parâmetros obrigatórios inválidos'
    );
  });

  it('deve lançar erro quando ano tem formato inválido em Candidaturas', async () => {
    const req = {
      query: {
        election: '2030402020',
        year: 'abc',
        municipality: '35157',
        position: '11',
      },
      headers: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(Candidaturas(req, res)).rejects.toThrow(
      'Ano precisa ter 4 dígitos'
    );
  });

  it('deve lançar erro quando município tem tipo inválido em Candidaturas', async () => {
    const req = {
      query: {
        election: '2030402020',
        year: '2020',
        municipality: {},
        position: '11',
      },
      headers: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(Candidaturas(req, res)).rejects.toThrow(
      'Código do município inválido'
    );
  });

  it('deve lançar erro quando posição tem tipo inválido em Candidaturas', async () => {
    const req = {
      query: {
        election: '2030402020',
        year: '2020',
        municipality: '35157',
        position: {},
      },
      headers: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(Candidaturas(req, res)).rejects.toThrow('Cargo inválido');
  });

  it('deve responder 200 com os dados do candidato buscado (invocação in-process)', async () => {
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
      localCandidatura: 'FEIRA DE SANTANA',
      ufCandidatura: '35157',
      ufSuperiorCandidatura: 'BA',
      dataUltimaAtualizacao: '2024-10-24 10:12',
      fotoUrl:
        'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2030402020/50000867342/35157',
      fotoUrlPublicavel: true,
      descricaoTotalizacao: 'Não eleito',
      cargo: {
        codigo: 11,
        nome: 'Prefeito',
      },
      partido: {
        numero: 40,
        sigla: 'PSB',
        nome: 'Partido Socialista Brasileiro',
      },
      eleicao: {
        id: 2030402020,
        ano: 2020,
        descricaoEleicao: '2020',
      },
      codigoSituacaoCandidato: 2,
      descricaoSituacaoCandidato: 'Consta da urna',
      isCandidatoInapto: false,
      candidatoApto: false,
    };

    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse });

    const req = {
      query: {
        eleicao: '2030402020',
        ano: '2020',
        municipio: '35157',
        candidato: '50000867342',
      },
      headers: {},
      url: '/api/eleicoes/candidaturas/v1/buscar/2020/35157/2030402020/50000867342',
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await BuscarCandidato(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
    expect(axios.get).toHaveBeenCalled();
  });

  it('deve lançar erro quando eleição está ausente em BuscarCandidato', async () => {
    const req = {
      query: {
        eleicao: null,
        ano: '2020',
        municipio: '35157',
        candidato: '50000867342',
      },
      headers: {},
      url: '/api/eleicoes/candidaturas/v1/buscar/2020/35157/null/50000867342',
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(BuscarCandidato(req, res)).rejects.toThrow(
      'Parâmetros obrigatórios inválidos'
    );
  });

  it('deve lançar erro quando ano está ausente em BuscarCandidato', async () => {
    const req = {
      query: {
        eleicao: '2030402020',
        ano: null,
        municipio: '35157',
        candidato: '50000867342',
      },
      headers: {},
      url: '/api/eleicoes/candidaturas/v1/buscar/null/35157/2030402020/50000867342',
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(BuscarCandidato(req, res)).rejects.toThrow(
      'Parâmetros obrigatórios inválidos'
    );
  });

  it('deve lançar erro quando município está ausente em BuscarCandidato', async () => {
    const req = {
      query: {
        eleicao: '2030402020',
        ano: '2020',
        municipio: null,
        candidato: '50000867342',
      },
      headers: {},
      url: '/api/eleicoes/candidaturas/v1/buscar/2020/null/2030402020/50000867342',
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(BuscarCandidato(req, res)).rejects.toThrow(
      'Parâmetros obrigatórios inválidos'
    );
  });

  it('deve lançar erro quando candidato está ausente em BuscarCandidato', async () => {
    const req = {
      query: {
        eleicao: '2030402020',
        ano: '2020',
        municipio: '35157',
        candidato: null,
      },
      headers: {},
      url: '/api/eleicoes/candidaturas/v1/buscar/2020/35157/2030402020/null',
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(BuscarCandidato(req, res)).rejects.toThrow(
      'Parâmetros obrigatórios inválidos'
    );
  });

  it('deve lançar erro quando ano tem formato inválido em BuscarCandidato', async () => {
    const req = {
      query: {
        eleicao: '2030402020',
        ano: 'abc',
        municipio: '35157',
        candidato: '50000867342',
      },
      headers: {},
      url: '/api/eleicoes/candidaturas/v1/buscar/abc/35157/2030402020/50000867342',
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(BuscarCandidato(req, res)).rejects.toThrow(
      'Ano precisa ter 4 dígitos'
    );
  });

  it('deve lançar erro quando ano tem menos de 4 dígitos em BuscarCandidato', async () => {
    const req = {
      query: {
        eleicao: '2030402020',
        ano: '202',
        municipio: '35157',
        candidato: '50000867342',
      },
      headers: {},
      url: '/api/eleicoes/candidaturas/v1/buscar/202/35157/2030402020/50000867342',
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    await expect(BuscarCandidato(req, res)).rejects.toThrow(
      'Ano precisa ter 4 dígitos'
    );
  });
});
