import axios from 'axios';

import NotFoundError from '@/errors/NotFoundError';

const API_BASE_URL = 'https://www.googleapis.com/books/v1';
const API_SEARCH_URL = `${API_BASE_URL}/volumes`;

/**
 * Parse the Google Books dimensions format into a proper object.
 *
 * @param {string} dimensions The Google Books dimensions.
 * @returns A object with width and height if valid.
 */
function parseDimensions(dimensions) {
  if (!dimensions) {
    return null;
  }

  return {
    width: parseFloat(dimensions.width.replace(/\s(cm|in)+$/, '')),
    height: parseFloat(dimensions.height.replace(/\s(cm|in)+$/, '')),
    unit: dimensions.width.includes('cm') ? 'CENTIMETER' : 'INCH',
  };
}

/**
 * Parse the Google Books price format into a proper object.
 *
 * @param {object} saleInfo The Google Books price.
 * @returns The price object.
 */
function parsePrice(saleInfo) {
  if (!saleInfo || saleInfo.saleability === 'NOT_FOR_SALE') {
    return null;
  }

  return {
    currency: saleInfo.retailPrice.currencyCode,
    amount: saleInfo.retailPrice.amount,
  };
}

/**
 * Search for book details into the Google Books database.
 *
 * @param {string} isbn The ISBN to search.
 * @returns The book details if found.
 */
export default async function searchInGoogleBooks(isbn) {
  const response = await axios.get(API_SEARCH_URL, {
    params: { q: `isbn:${isbn}` },
    headers: { Accept: 'application/json' },
  });

  if (!response.data.items || !response.data.items[0]) {
    throw new NotFoundError({ message: 'ISBN não encontrado' });
  }

  const gbBook = response.data.items[0];

  const { volumeInfo } = gbBook;

  return {
    isbn,
    title: volumeInfo.title.trim(),
    subtitle: null,
    authors: volumeInfo.authors,
    publisher: volumeInfo.publisher,
    synopsis: volumeInfo.description,
    dimensions: parseDimensions(volumeInfo.dimensions),
    year:
      volumeInfo.publishedDate &&
      parseInt(volumeInfo.publishedDate.substring(0, 4), 10),
    format: gbBook.saleInfo.isEbook ? 'DIGITAL' : 'PHYSICAL',
    page_count: volumeInfo.pageCount,
    subjects: volumeInfo.categories,
    location: null,
    retail_price: parsePrice(gbBook.saleInfo),
    cover_url:
      volumeInfo.imageLinks.extraLarge ||
      volumeInfo.imageLinks.large ||
      volumeInfo.imageLinks.medium ||
      volumeInfo.imageLinks.small ||
      volumeInfo.imageLinks.thumbnail ||
      volumeInfo.imageLinks.smallThumbnail,
    provider: 'google-books',
  };
}
