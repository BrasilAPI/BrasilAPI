export default function removeSpecialChars(text) {
  const hexaChars = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
  };

  let newText = '';
  Object.keys(hexaChars).forEach((letter) => {
    const regex = hexaChars[letter];
    newText = text.replace(regex, letter);
  });

  return newText.toLowerCase().replace(/[^\w ]+/g, '');
}
