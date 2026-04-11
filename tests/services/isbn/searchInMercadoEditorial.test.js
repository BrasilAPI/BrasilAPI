import { describe, test, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import searchInMercadoEditorial from '@/services/isbn/mercadoEditorial';

vi.mock('axios');

describe('searchInMercadoEditorial - MC/DC Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('CT1: D1 - books é null', async () => {
    axios.get.mockResolvedValue({
      data: { books: null },
    });

    await expect(searchInMercadoEditorial('9786555140576')).rejects.toThrow(
      'ISBN não encontrado'
    );
  });

  test('CT2: D1 - books é undefined', async () => {
    axios.get.mockResolvedValue({
      data: {},
    });

    await expect(searchInMercadoEditorial('9786555140576')).rejects.toThrow(
      'ISBN não encontrado'
    );
  });

  test('CT3: D1 - books vazio', async () => {
    axios.get.mockResolvedValue({
      data: { books: [] },
    });

    await expect(searchInMercadoEditorial('9786555140576')).rejects.toThrow(
      'ISBN não encontrado'
    );
  });

  test('CT4: D1 - livro válido completo', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: 'Edição Completa',
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir Livraria' },
      sinopse: 'Uma história de terror',
      medidas: { largura: 17, altura: 25, paginas: 400 },
      ano_edicao: '2021',
      formato: 'BOOK',
      moeda: 'BRL',
      preco: '89.90',
      catalogacao: { palavras_chave: 'mangá,terror,horror' },
      imagens: {
        imagem_primeira_capa: {
          grande: 'https://exemplo.com/capa.jpg',
        },
      },
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');

    expect(result).toEqual({
      isbn: '9786555140576',
      title: 'Uzumaki',
      subtitle: 'Edição Completa',
      authors: ['Junji Ito'],
      publisher: 'Devir Livraria',
      synopsis: 'Uma história de terror',
      dimensions: {
        width: 17,
        height: 25,
        unit: 'CENTIMETER',
      },
      year: 2021,
      format: 'PHYSICAL',
      page_count: 400,
      subjects: ['mangá', 'terror', 'horror'],
      location: null,
      retail_price: {
        currency: 'BRL',
        amount: 89.9,
      },
      cover_url: 'https://exemplo.com/capa.jpg',
      provider: 'mercado-editorial',
    });
  });

  test('CT5: D2 - subtitulo é null', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.subtitle).toBeNull();
  });

  test('CT6: D2 - subtitulo string vazia', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: '',
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.subtitle).toBeNull();
  });

  test('CT7: D2 - subtitulo com conteúdo', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: 'Edição Especial',
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.subtitle).toBe('Edição Especial');
  });

  test('CT8: D3 - medidas é null', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.page_count).toBeNull();
  });

  test('CT9: D3 - medidas existe mas paginas não', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: { largura: 17, altura: 25 },
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.page_count).toBeNull();
  });

  test('CT10: D3 - medidas e paginas existem', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: { largura: 17, altura: 25, paginas: '350' },
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.page_count).toBe(350);
  });

  test('CT11: D4 - imagens é null', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.cover_url).toBeNull();
  });

  test('CT12: D4 - imagens existe mas imagem_primeira_capa não', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: {},
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.cover_url).toBeUndefined();
  });

  test('CT13: D4 - imagem_primeira_capa existe mas grande não', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: {
        imagem_primeira_capa: {},
      },
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.cover_url).toBeUndefined();
  });

  test('CT14: D4 - imagens completas', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: {
        imagem_primeira_capa: {
          grande: 'https://exemplo.com/uzumaki.jpg',
        },
      },
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.cover_url).toBe('https://exemplo.com/uzumaki.jpg');
  });

  test('CT15: formato DIGITAL', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Uzumaki',
      subtitulo: null,
      contribuicao: [{ nome: 'Junji', sobrenome: 'Ito' }],
      editora: { nome_fantasia: 'Devir' },
      sinopse: 'Terror',
      medidas: null,
      ano_edicao: null,
      formato: 'EBOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.format).toBe('DIGITAL');
  });

  test('CT16: múltiplos autores', async () => {
    const mockBook = {
      isbn: '9786555140576',
      titulo: 'Livro Colaborativo',
      subtitulo: null,
      contribuicao: [
        { nome: 'João', sobrenome: 'Silva' },
        { nome: 'Maria', sobrenome: 'Santos' },
        { nome: 'Pedro', sobrenome: 'Oliveira' },
      ],
      editora: { nome_fantasia: 'Editora Teste' },
      sinopse: 'Descrição',
      medidas: null,
      ano_edicao: null,
      formato: 'BOOK',
      moeda: null,
      preco: null,
      catalogacao: null,
      imagens: null,
    };

    axios.get.mockResolvedValue({
      data: { books: [mockBook] },
    });

    const result = await searchInMercadoEditorial('9786555140576');
    expect(result.authors).toEqual([
      'João Silva',
      'Maria Santos',
      'Pedro Oliveira',
    ]);
  });
});
