import app from '@/app';
import { getTussTerms, searchTuss } from '@/services/tuss';

function parseLimit(limit) {
  if (typeof limit !== 'string') return undefined;
  const n = Number.parseInt(limit, 10);
  if (Number.isNaN(n) || n <= 0) return undefined;
  return n;
}

function parseOffset(offset) {
  if (typeof offset !== 'string') return 0;
  const n = Number.parseInt(offset, 10);
  if (Number.isNaN(n) || n < 0) return 0;
  return n;
}

function paginate(items, limitNum, offsetNum) {
  if (typeof limitNum === 'number') {
    const start = offsetNum;
    const end = offsetNum + limitNum;
    return items.slice(start, end);
  }
  if (offsetNum > 0) {
    return items.slice(offsetNum);
  }
  return items;
}

async function TussSearch(request, response) {
  const { name, tuss, limit, offset } = request.query;

  const hasName = typeof name === 'string' && name.trim().length > 0;
  const hasTuss = typeof tuss === 'string' && tuss.trim().length > 0;

  let data;

  if (hasName || hasTuss) {
    data = searchTuss({ name, tuss });
  } else {
    data = getTussTerms();
  }

  const limitNum = parseLimit(limit);
  const offsetNum = parseOffset(offset);

  const total = Array.isArray(data) ? data.length : 0;

  const items = paginate(data, limitNum, offsetNum);

  const payload = {
    total,
    limit: typeof limitNum === 'number' ? limitNum : null,
    offset: offsetNum,
    items,
  };

  return response.status(200).json(payload);
}

export default app().get(TussSearch);
