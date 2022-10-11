import axios from 'axios';

import NotFoundError from '@/errors/NotFoundError';

const API_BASE_URL = 'https://openlibrary.org';
const API_SEARCH_URL = `${API_BASE_URL}/api/books`;

/**
 * Parse the Open Library dimensions format into a proper object.
 *
 * @param {string} dimensionsStr The Open Library dimensions.
 * @returns A object with width and height if valid.
 */
function parseDimensions(dimensions) {
  if (!dimensions) {
    return null;
  }

  const values = dimensions
    .replace(/ (centimeters|inches)$/, '')
    .split(' x ')
    .map(parseFloat)
    .filter((dm) => !Number.isNaN(dm));

  if (values.length !== 3) {
    return null;
  }

  return {
    width: values[1],
    height: values[0],
    unit: dimensions.includes('centimeters') ? 'CENTIMETER' : 'INCH',
  };
}

/**
 * Parse the Open Library publish date into a proper year number.
 *
 * @param {string} publishDate The Open Library publish date.
 * @returns A parsed year as a number if it matches
 */
function parseYear(publishDate) {
  const match = publishDate && publishDate.match(/\d{4}/)[0];

  return match ? parseInt(match, 10) : null;
}

/**
 * Search for book details into the Open Library database.
 *
 * @param {string} isbn The ISBN to search.
 * @returns The book details if found.
 */
export default async function searchInOpenLibrary(isbn) {
  const bibKey = `ISBN:${isbn}`;

  const response = await axios.get(API_SEARCH_URL, {
    params: {
      bibkeys: bibKey,
      jscmd: 'data',
      format: 'json',
    },
    headers: { Accept: 'application/json' },
  });

  if (Object.keys(response.data).length === 0 || !response.data[bibKey]) {
    throw new NotFoundError({ message: 'ISBN não encontrado' });
  }

  const olBook = response.data[bibKey];

  const { data: details } = await axios.get(
    `${API_BASE_URL}/isbn/${isbn}.json`,
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  return {
    isbn,
    title: olBook.title,
    subtitle: olBook.subtitle,
    authors: olBook.authors.map((contributor) => contributor.name),
    publisher: olBook.publishers.map((publisher) => publisher.name).join(' & '),
    synopsis: details.description && details.description.value,
    dimensions: parseDimensions(details.physical_dimensions),
    year: parseYear(olBook.publish_date),
    format: 'PHYSICAL',
    page_count: olBook.number_of_pages,
    subjects: (olBook.subjects || []).map((subject) => subject.name),
    location:
      olBook.publish_places &&
      olBook.publish_places[0] &&
      olBook.publish_places[0].name &&
      olBook.publish_places[0].name.replace('Brazil', 'Brasil'),
    retail_price: null,
    cover_url: olBook.cover && olBook.cover.large,
    provider: 'open-library',
  };
}
