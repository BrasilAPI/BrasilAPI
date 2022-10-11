import axios from 'axios';

import NotFoundError from '@/errors/NotFoundError';

const API_BASE_URL = 'https://api.mercadoeditorial.org/api/v1.2';
const API_SEARCH_URL = `${API_BASE_URL}/book`;

/**
 * Parse the Mercado Editorial dimensions format into a proper object.
 *
 * @param {string} dimensions The Mercado Editorial dimensions.
 * @returns A object with width and height if valid.
 */
function parseDimensions(dimensions) {
  if (!dimensions) {
    return null;
  }

  return {
    width: parseFloat(dimensions.largura),
    height: parseFloat(dimensions.altura),
    unit: 'CENTIMETER',
  };
}

/**
 * Parse separated currency and price into a price object
 * if both are valid and non-null.
 *
 * @param {string} currency The currency of the book price.
 * @param {string} price The price of the book.
 * @returns The price object.
 */
function parsePrice(currency, price) {
  if (!currency || !price) {
    return null;
  }

  if (currency.length === 0 || price.length === 0) {
    return null;
  }

  return {
    currency,
    amount: parseFloat(price),
  };
}

/**
 * Search for book details into the Mercado Editorial database.
 *
 * @param {string} isbn The ISBN to search.
 * @returns The book details if found.
 */
export default async function searchInMercadoEditorial(isbn) {
  const response = await axios.get(API_SEARCH_URL, {
    params: { isbn },
    headers: { Accept: 'application/json' },
  });

  if (!response.data.books || !response.data.books[0]) {
    throw new NotFoundError({ message: 'ISBN não encontrado' });
  }

  const meBook = response.data.books[0];

  return {
    isbn: meBook.isbn,
    title: meBook.titulo,
    subtitle: meBook.subtitulo.length > 0 ? meBook.subtitulo : null,
    authors: meBook.contribuicao.map(
      (contributor) => `${contributor.nome} ${contributor.sobrenome}`
    ),
    publisher: meBook.editora.nome_fantasia,
    synopsis: meBook.sinopse,
    dimensions: parseDimensions(meBook.medidas),
    year: meBook.ano_edicao ? parseInt(meBook.ano_edicao, 10) : null,
    format: meBook.formato === 'BOOK' ? 'PHYSICAL' : 'DIGITAL',
    page_count:
      meBook.medidas && meBook.medidas.paginas
        ? parseInt(meBook.medidas.paginas, 10)
        : null,
    subjects:
      meBook.catalogacao && meBook.catalogacao.palavras_chave.split(','),
    location: null,
    retail_price: parsePrice(meBook.moeda, meBook.preco),
    cover_url:
      meBook.imagens &&
      meBook.imagens.imagem_primeira_capa &&
      meBook.imagens.imagem_primeira_capa.grande,
    provider: 'mercado-editorial',
  };
}
