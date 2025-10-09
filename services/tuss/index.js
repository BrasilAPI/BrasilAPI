import removeSpecialChars from '@/util/removeSpecialChars';
import tussTerms from './tussTerms.json';

export function getTussTerms() {
  return Array.isArray(tussTerms) ? tussTerms : [];
}

function normalize(str) {
  return removeSpecialChars(String(str || ''));
}

function sanitizeCode(str) {
  return String(str || '').replace(/\D+/g, '');
}

export function searchTuss({ name, tuss }) {
  let terms = getTussTerms();

  const hasName = typeof name === 'string' && name.trim().length > 0;
  const hasTuss = typeof tuss === 'string' && tuss.trim().length > 0;

  if (!hasName && !hasTuss) {
    return terms;
  }

  const nameQuery = hasName ? normalize(name) : null;
  const tussQuery = hasTuss ? sanitizeCode(tuss) : null;

  terms = terms.filter((item) => {
    const itemName = normalize(item.name || item.nome || item.descricao);
    const itemCode = sanitizeCode(item.tuss || item.codigo || item.codigo_tuss);

    const matchName = hasName ? itemName.includes(nameQuery) : true;
    const matchCode = hasTuss ? itemCode.startsWith(tussQuery) : true;

    return matchName && matchCode;
  });

  return terms;
}

export function findTussByCodeExact(code) {
  const query = sanitizeCode(code);
  const terms = getTussTerms();
  return terms.find((item) => {
    const itemCode = sanitizeCode(item.tuss || item.codigo || item.codigo_tuss);
    return itemCode === query;
  });
}

function compareAsc(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function sortTerms(terms, sort = 'tuss', order = 'asc') {
  const isDesc = String(order).toLowerCase() === 'desc';
  const key = String(sort).toLowerCase();

  const sorted = [...terms].sort((x, y) => {
    const nx = normalize(x.name || x.nome || x.descricao);
    const ny = normalize(y.name || y.nome || y.descricao);
    const cx = sanitizeCode(x.tuss || x.codigo || x.codigo_tuss);
    const cy = sanitizeCode(y.tuss || y.codigo || y.codigo_tuss);

    let cmp = 0;
    if (key === 'name') {
      cmp = compareAsc(nx, ny);
    } else {
      // default sort by tuss code (lexical compare of digits)
      cmp = compareAsc(cx, cy);
    }
    return isDesc ? -cmp : cmp;
  });

  return sorted;
}

export function searchTussAdvanced({
  q,
  name,
  tuss,
  match = 'prefix',
  sort = 'tuss',
  order = 'asc',
}) {
  let terms = getTussTerms();

  const hasQ = typeof q === 'string' && q.trim().length > 0;
  const hasName = typeof name === 'string' && name.trim().length > 0;
  const hasTuss = typeof tuss === 'string' && tuss.trim().length > 0;

  if (!hasQ && !hasName && !hasTuss) {
    return sortTerms(terms, sort, order);
  }

  const nameQuery = hasName ? normalize(name) : null;
  const tussQuery = hasTuss ? sanitizeCode(tuss) : null;
  const tokens = hasQ ? String(q).split(/\s+/).filter(Boolean) : [];

  const isExact = String(match).toLowerCase() === 'exact';

  terms = terms.filter((item) => {
    const itemName = normalize(item.name || item.nome || item.descricao);
    const itemCode = sanitizeCode(item.tuss || item.codigo || item.codigo_tuss);

    const matchName = (() => {
      if (!hasName) return true;
      if (isExact) return itemName === nameQuery;
      return itemName.includes(nameQuery);
    })();

    const matchCode = (() => {
      if (!hasTuss) return true;
      if (isExact) return itemCode === tussQuery;
      return itemCode.startsWith(tussQuery);
    })();

    let matchQ = true;
    if (hasQ) {
      matchQ = tokens.every((t) => {
        const isDigits = /^(\d+)$/.test(t);
        if (isDigits) {
          const qt = sanitizeCode(t);
          return isExact ? itemCode === qt : itemCode.startsWith(qt);
        }
        const nt = normalize(t);
        return itemName.includes(nt);
      });
    }

    return matchName && matchCode && matchQ;
  });

  return sortTerms(terms, sort, order);
}
