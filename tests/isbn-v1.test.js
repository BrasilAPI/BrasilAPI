import axios from 'axios';
import { describe, test, expect, beforeAll } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

describe('api/isbn/v1 (E2E)', () => {
  let requestUrl = '';

  beforeAll(async () => {
    requestUrl = `${global.SERVER_URL}/api/isbn/v1`;
  });

  test('Utilizando um ISBN válido existente: 9788545702870', async () => {
    const response = await axios.get(`${requestUrl}/9788545702870`);
    const { data, status } = response;

    // Tests here are done most with containing to handle the particular
    // case where the provider returned is OpenLibrary, since it is open
    // to public edition like Wikipedia, so the values may change over time.

    // Missing tests for subtitle, cover_url and retail_price, as some
    // may not return it. Individual tests for that are done for each provider.
    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9788545702870',
        title: expect.stringContaining('Akira'),
        authors: expect.arrayContaining([expect.stringMatching(/katsuhiro/i)]),
        publisher: expect.any(String),
        synopsis: expect.any(String),
        dimensions: expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
          unit: 'CENTIMETER',
        }),
        year: expect.any(Number),
        format: 'PHYSICAL',
        page_count: expect.any(Number),
        subjects: expect.arrayContaining([expect.any(String)]),
        location: expect.toSatisfy(
          (valor) => typeof valor === 'string' || valor === null
        ),
        provider: expect.stringMatching(
          /^(?:cbl|mercado-editorial|google-books|open-library)$/
        ),
      })
    );
  });

  test('Utilizando um ISBN válido não existente: 9788549173447', async () => {
    try {
      await axios.get(`${requestUrl}/9788549173447`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual({
        message: 'ISBN não encontrado',
        name: 'NotFoundError',
        type: 'not_found',
      });
    }
  });

  test('Utilizando um ISBN inválido: 9788491734444', async () => {
    try {
      await axios.get(`${requestUrl}/9788491734444`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual({
        message: 'ISBN inválido',
        name: 'BadRequestError',
        type: 'bad_request',
      });
    }
  });

  test('Utilizando provider cbl', async () => {
    const response = await axios.get(
      `${requestUrl}/9788545702870?providers=cbl`
    );
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9788545702870',
        title: expect.stringContaining('Akira'),
        subtitle: null,
        authors: expect.arrayContaining([
          'KATSUHIRO OTOMO',
          'DRIK SADA',
          'CASSIUS MEDAUAR',
          'MARCELO DEL GRECO',
          'DENIS TAKATA',
        ]),
        publisher: 'Japorama Editora e Comunicação',
        synopsis: expect.stringContaining('Um dos marcos da ficção científica'),
        dimensions: expect.objectContaining({
          width: 17.5,
          height: 25.7,
          unit: 'CENTIMETER',
        }),
        year: 2017,
        format: 'PHYSICAL',
        page_count: 364,
        subjects: expect.arrayContaining([
          'Cartoons; caricaturas e quadrinhos',
          'mangá',
          'motocicleta',
          'gangue',
          'Delinquência',
        ]),
        location: 'SÃO PAULO, SP',
        retail_price: null,
        cover_url: null,
        provider: 'cbl',
      })
    );
  });

  test('Utilizando provider mercado-editorial', async () => {
    const response = await axios.get(
      `${requestUrl}/9786555140576?providers=mercado-editorial`
    );
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9786555140576',
        title: expect.stringContaining('Uzumaki'),
        subtitle: null,
        authors: expect.arrayContaining(['Junji Ito']),
        publisher: expect.stringContaining('Devir'),
        synopsis: expect.stringContaining(
          'Acontecimentos grotescos começam a surgir em Kurôzu'
        ),
        dimensions: expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
          unit: 'CENTIMETER',
        }),
        year: 2021,
        format: 'PHYSICAL',
        page_count: expect.any(Number),
        subjects: expect.arrayContaining(['mangá', 'terror', 'horror']),
        location: null,
        retail_price: expect.objectContaining({
          currency: 'BRL',
          amount: expect.any(Number),
        }),
        cover_url:
          'https://fl-storage.bookinfometadados.com.br/uploads/book/first_cover/9786555140576.jpg',
        provider: 'mercado-editorial',
      })
    );
  });

  test('Utilizando provider open-library', async () => {
    const response = await axios.get(
      `${requestUrl}/9788545702870?providers=open-library`
    );
    const { data, status } = response;

    expect(status).toEqual(200);

    // Tests here are done most with containing since OpenLibrary is open
    // to public edition like Wikipedia, so it may change over time.
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9788545702870',
        title: expect.stringContaining('Akira'),
        subtitle: expect.stringContaining('Part 1'),
        authors: expect.arrayContaining(['Katsuhiro Ōtomo']),
        publisher: expect.stringContaining('JBC'),
        synopsis: expect.stringContaining('Um dos marcos da ficção científica'),
        dimensions: expect.objectContaining({
          width: 17.8,
          height: 25.6,
          unit: 'CENTIMETER',
        }),
        year: 2017,
        format: 'PHYSICAL',
        page_count: 362,
        subjects: expect.arrayContaining([
          'Comic books, strips',
          'Graphic novels',
        ]),
        location: expect.stringContaining('São Paulo'),
        retail_price: null,
        cover_url: 'https://covers.openlibrary.org/b/id/11890190-L.jpg',
        provider: 'open-library',
      })
    );
  });

  test('Utilizando provider google-books', async () => {
    const response = await axios.get(
      `${requestUrl}/9788545712466?providers=google-books`
    );
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(
      expect.objectContaining({
        isbn: '9788545712466',
        title: 'Boa Noite Punpun vol. 01',
        subtitle: null,
        authors: expect.arrayContaining(['Inio Asano']),
        publisher: 'Editora JBC',
        synopsis: expect.stringContaining('Punpun Onodera é um garoto normal'),
        dimensions: null,
        year: 2019,
        format: 'DIGITAL',
        page_count: 432,
        subjects: expect.arrayContaining(['Comics & Graphic Novels']),
        location: null,
        retail_price: expect.objectContaining({
          currency: 'BRL',
          amount: 32.9,
        }),
        cover_url: expect.stringContaining(
          'https://books.google.com/books/content?id=hU2jDwAAQBAJ'
        ),
        provider: 'google-books',
      })
    );
  });
});

testCorsForRoute('/api/isbn/v1/9788545702870');
