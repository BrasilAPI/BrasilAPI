export default function removeSpecialChars(text) {
  const newText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return newText.toLowerCase().replace(/[^\w ]+/g, '');
}
