import app from '@/app';
import { getTussTerms, searchTuss } from '@/services/tuss';

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

  let limitNum;
  let offsetNum = 0;

  if (typeof limit === 'string') {
    const parsed = parseInt(limit, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limitNum = parsed;
    }
  }

  if (typeof offset === 'string') {
    const parsed = parseInt(offset, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      offsetNum = parsed;
    }
  }

  const total = Array.isArray(data) ? data.length : 0;

  let items = data;
  if (typeof limitNum === 'number') {
    const start = offsetNum;
    const end = offsetNum + limitNum;
    items = items.slice(start, end);
  } else if (offsetNum > 0) {
    items = items.slice(offsetNum);
  }

  const payload = {
    total,
    limit: typeof limitNum === 'number' ? limitNum : null,
    offset: offsetNum,
    items,
  };

  return response.status(200).json(payload);
}

export default app().get(TussSearch);
