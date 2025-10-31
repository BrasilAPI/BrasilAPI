/**
 * Testes unitários do método searchInCbl
 * Classe/Módulo: services/ISBN/Cbl/searchInCbl.js
 * Repositório: https://github.com/BrasilAPI/BrasilAPI
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Importa o método a ser testado
import searchInCbl from '../services/isbn/cbl';

// Mock da biblioteca axios para evitar chamadas reais à API
vi.mock('axios');

describe('searchInCbl - Testes Unitários', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===============================================================
  // CT01 – D1: ISBN10 → Verdadeiro (converte para ISBN13)
  // ===============================================================
  test('CT01 - Deve converter ISBN10 para ISBN13 quando isbn.length === 10', async () => {
    const isbn = '1234567890';
    axios.post.mockResolvedValue({
      data: { value: [{ Title: 'Livro Exemplo' }] },
    });

    await searchInCbl(isbn);

    // Espera que tenha chamado a API com o ISBN13 convertido no payload
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('https://isbn-search-br.search.windows.net'),
      expect.objectContaining({
        search: expect.stringContaining('9781234567897'),
      }),
      expect.any(Object)
    );
  });

  // ===============================================================
  // CT02 – D2: ISBN13 → Verdadeiro (converte para ISBN10)
  // ===============================================================
  test('CT02 - Deve converter ISBN13 para ISBN10 quando isbn.length === 13', async () => {
    const isbn = '9781234567897';
    axios.post.mockResolvedValue({
      data: { value: [{ Title: 'Livro Exemplo' }] },
    });

    await searchInCbl(isbn);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('https://isbn-search-br.search.windows.net'),
      expect.objectContaining({
        search: expect.stringContaining('1234567890'),
      }),
      expect.any(Object)
    );
  });

  // ===============================================================
  // CT03 – D3: !dimensionsStr → Verdadeiro (retorna null)
  // ===============================================================
  test('CT03 - Retorna dimensions = null quando Dimensao for nulo ou indefinido', async () => {
    const isbn = '9781234567897';
    axios.post.mockResolvedValue({
      data: { value: [{ Dimensao: null }] },
    });

    const result = await searchInCbl(isbn);
    expect(result.dimensions).toBeNull();
  });

  // ===============================================================
  // CT04 – D4: !dimensions → Verdadeiro (regex não encontrou dimensões)
  // ===============================================================
  test('CT04 - Retorna dimensions = null quando regex não encontrar dimensões', async () => {
    const isbn = '9781234567897';
    axios.post.mockResolvedValue({
      data: { value: [{ Dimensao: 'invalido' }] },
    });

    const result = await searchInCbl(isbn);
    expect(result.dimensions).toBeNull();
  });

  // ===============================================================
  // CT05 – D4: !dimensions → Falso (regex retorna objeto válido)
  // ===============================================================
  test('CT05 - Retorna objeto dimensions válido quando regex encontra dimensões', async () => {
    const isbn = '9781234567897';
    axios.post.mockResolvedValue({
      data: { value: [{ Dimensao: '20x15' }] },
    });

    const result = await searchInCbl(isbn);
    expect(result.dimensions).toEqual(
      expect.objectContaining({
        width: expect.any(Number),
        height: expect.any(Number),
        unit: 'CENTIMETER',
      })
    );
  });

  // ===============================================================
  // CT06 – D5: (!city || !state) → Verdadeiro (um ou ambos nulos)
  // ===============================================================
  test('CT06 - Retorna location = null quando Cidade ou UF forem nulos', async () => {
    const isbn = '9781234567897';
    axios.post.mockResolvedValue({
      data: { value: [{ Cidade: null, UF: 'SP' }] },
    });

    const result = await searchInCbl(isbn);
    expect(result.location).toBeNull();
  });

  // ===============================================================
  // CT07 – D6: (city/state vazios) → Verdadeiro
  // ===============================================================
  test('CT07 - Retorna location = null quando Cidade ou UF forem vazios', async () => {
    const isbn = '9781234567897';
    axios.post.mockResolvedValue({
      data: { value: [{ Cidade: '', UF: '' }] },
    });

    const result = await searchInCbl(isbn);
    expect(result.location).toBeNull();
  });

  // ===============================================================
  // CT08 – D5/D6: Ambas Falsas (city e state válidos)
  // ===============================================================
  test('CT08 - Retorna location formatada corretamente quando Cidade e UF existem e não estão vazios', async () => {
    const isbn = '9781234567897';
    axios.post.mockResolvedValue({
      data: { value: [{ Cidade: 'São Paulo', UF: 'SP' }] },
    });

    const result = await searchInCbl(isbn);
    expect(result.location).toBe('São Paulo, SP');
  });

  // ===============================================================
  // CT09 – D7: (!response.data.value || !response.data.value[0]) → Verdadeiro
  // ===============================================================
  test('CT09 - Lança NotFoundError quando resposta da API é vazia', async () => {
    const isbn = '9781234567897';
    axios.post.mockResolvedValue({ data: { value: [] } });

    await expect(searchInCbl(isbn)).rejects.toThrow('ISBN não encontrado');
  });

  // ===============================================================
  // CT10 – D7: (!response.data.value || !response.data.value[0]) → Falso
  // ===============================================================
  test('CT10 - Retorna objeto do livro quando resposta da API é válida', async () => {
    const isbn = '9781234567897';
    const mockBook = {
      RowKey: isbn,
      Title: 'Livro Teste',
      Authors: ['Autor Exemplo'],
      Imprint: 'Editora X',
      Sinopse: 'Resumo do livro',
      Ano: '2023',
      Formato: 'Papel',
      Paginas: '250',
      Subject: 'Ficção',
      PalavrasChave: ['Fantasia', 'Aventura'],
      Cidade: 'Rio de Janeiro',
      UF: 'RJ',
    };

    axios.post.mockResolvedValue({ data: { value: [mockBook] } });

    const result = await searchInCbl(isbn);
    expect(result).toMatchObject({
      isbn: mockBook.RowKey,
      title: mockBook.Title,
      authors: mockBook.Authors,
      publisher: mockBook.Imprint,
      synopsis: mockBook.Sinopse,
      year: 2023,
      format: 'PHYSICAL',
      page_count: 250,
      location: 'Rio de Janeiro, RJ',
      subjects: expect.arrayContaining(['Ficção', 'Fantasia', 'Aventura']),
      provider: 'cbl',
    });
  });
});
