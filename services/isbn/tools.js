const ISBN_PATTERN = /^978[68]5\d{8}$|^[68]5\d{7}[0-9xX]{1}$/;

/**
 * Validates a ISBN string by checking the verififier digit.
 * Both formats are supported (obsolete 10 digits and
 * current 13 digits one).
 *
 * By design it supports only Brazilian ISBNs.
 *
 * @param {string} isbn The ISBN to be validated
 * @returns true if the ISBN provided is valid
 */
export function validateIsbn(isbn) {
  const isbnDigits = isbn.toUpperCase();

  if (isbnDigits.length !== 10 && isbnDigits.length !== 13) {
    return false;
  }

  if (!isbnDigits.match(ISBN_PATTERN)) {
    return false;
  }

  if (isbnDigits.length === 10) {
    const checkSum = isbnDigits
      .split('')
      .map((d, i) => (10 - i) * (d === 'X' ? 10 : parseInt(d, 10)))
      .reduce((sum, parcel) => sum + parcel, 0);

    return checkSum % 11 === 0;
  }

  const checkSum = isbnDigits
    .split('')
    .map((d, i) => ((i + 1) % 2 === 0 ? 3 : 1) * parseInt(d, 10))
    .reduce((sum, parcel) => sum + parcel, 0);

  return checkSum % 10 === 0;
}

/**
 * Convert a valid ISBN-13 string to a obsolete ISBN-10.
 *
 * @param {string} isbn13 The ISBN-13 representation.
 * @returns The ISBN-10 representation.
 */
export function convertIsbn13ToIsbn10(isbn13) {
  if (!validateIsbn(isbn13)) {
    return null;
  }

  if (isbn13.length === 10) {
    return isbn13;
  }

  const equalPart = isbn13.slice(3, -1);
  const checkSum = equalPart
    .split('')
    .map((d, i) => parseInt(d, 10) * (i + 1))
    .reduce((sum, parcel) => sum + parcel, 0);
  const lastDigit = checkSum % 11;

  return equalPart + (lastDigit === 10 ? 'X' : lastDigit);
}

/**
 * Convert a valid ISBN-10 string to a current ISBN-13.
 *
 * @param {string} isbn10 The ISBN-10 representation.
 * @returns The ISBN-13 representation.
 */
export function convertIsbn10ToIsbn13(isbn10) {
  if (!validateIsbn(isbn10)) {
    return null;
  }

  if (isbn10.length === 13) {
    return isbn10;
  }

  const newIsbn = `978${isbn10.slice(0, -1)}`;
  const checkSum = newIsbn
    .split('')
    .map((d, i) => ((i + 1) % 2 === 0 ? 3 : 1) * parseInt(d, 10))
    .reduce((sum, parcel) => sum + parcel, 0);
  const lastDigit = checkSum % 10;

  return newIsbn + (lastDigit !== 0 ? 10 - lastDigit : 0);
}
