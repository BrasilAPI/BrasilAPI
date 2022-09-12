import axios from 'axios';

import NotFoundError from '@/errors/NotFoundError';
import { convertIsbn10ToIsbn13, convertIsbn13ToIsbn10 } from './tools';

const API_BASE_URL =
  'https://isbn-search-br.search.windows.net/indexes/isbn-index/docs';
const API_SEARCH_URL = `${API_BASE_URL}/search?api-version=2016-09-01`;

/**
 * The key used is the same from the CBL official website.
 *
 * Encoded as base-64 to not display it directly.
 */
const API_BASE64_KEY = 'MTAwMjE2QTIzQzVBRUUzOTAzMzhCQkQxOUVBODZEMjk=';
const API_KEY = Buffer.from(API_BASE64_KEY, 'base64').toString('utf-8');

/**
 * Parse the CBL dimensions format into a proper object.
 *
 * @param {string} dimensionsStr The CBL dimensions.
 * @returns A object with width and height if valid.
 */
function parseDimensions(dimensionsStr) {
  const dimensions = dimensionsStr
    ? dimensionsStr.match(/(\d{2})(\d)?x(\d{2})(\d)?$/)
    : null;

  if (!dimensions) {
    return null;
  }

  return {
    width: parseFloat(
      dimensions[1] + (dimensions[2] ? `.${dimensions[2]}` : '')
    ),
    height: parseFloat(
      dimensions[3] + (dimensions[4] ? `.${dimensions[4]}` : '')
    ),
    unit: 'CENTIMETER',
  };
}

/**
 * Parse separated city and state strings into a full
 * location if both are valid and non-null.
 *
 * @param {string} city The city where the book was published.
 * @param {string} state The state where the book was published.
 * @returns The full location string.
 */
function parseLocation(city, state) {
  if (!city || !state) {
    return null;
  }

  if (city.length === 0 || state.length === 0) {
    return null;
  }

  return `${city}, ${state}`;
}

/**
 * Search for book details into the CBL database.
 *
 * @param {string} isbn The ISBN to search.
 * @returns The book details if found.
 */
export default async function cblSearch(isbn) {
  const isbn13 = isbn.length === 10 ? convertIsbn10ToIsbn13(isbn) : isbn;
  const isbn10 = isbn.length === 13 ? convertIsbn13ToIsbn10(isbn) : isbn;

  // Try to mimic the CBL website request.
  const searchPayload = {
    count: true,
    facets: ['Imprint,count:50', 'Authors,count:50'],
    filter: '',
    orderby: null,
    queryType: 'full',
    search: `${isbn13} OR ${isbn10}`,
    searchFields: 'FormattedKey,RowKey',
    searchMode: 'any',
    select: '*',
    skip: 0,
    top: 12,
  };

  const response = await axios.post(API_SEARCH_URL, searchPayload, {
    headers: {
      Accept: 'application/json',
      'Api-Key': API_KEY,
    },
  });

  if (!response.data.value || !response.data.value[0]) {
    throw new NotFoundError({
      message: 'ISBN não encontrado',
      type: 'isbn_error',
      name: 'ISBN_NOT_FOUND',
    });
  }

  const cblBook = response.data.value[0];

  return {
    isbn: cblBook.RowKey,
    title: cblBook.Title,
    subtitle: cblBook.Subtitle,
    authors: cblBook.Authors,
    publisher: cblBook.Imprint,
    synopsis: cblBook.Sinopse,
    dimensions: parseDimensions(cblBook.Dimensao),
    year: cblBook.Ano ? parseInt(cblBook.Ano, 10) : null,
    format: cblBook.Formato === 'Papel' ? 'PHYSICAL' : 'DIGITAL',
    page_count: cblBook.Paginas ? parseInt(cblBook.Paginas, 10) : null,
    subjects: cblBook.Subject ? [cblBook.Subject] : [],
    location: parseLocation(cblBook.Cidade, cblBook.UF),
    retail_price: null,
    cover_url: null,
    provider: 'CBL',
  };
}
