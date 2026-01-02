import app from '@/app';
import { searchTussAdvanced } from '@/services/tuss';

function project(item, fields) {
  if (!Array.isArray(fields) || fields.length === 0) return item;
  return fields.reduce(
    (acc, key) =>
      item[key] === undefined ? acc : { ...acc, [key]: item[key] },
    {}
  );
}

async function TussSearchAdvanced(request, response) {
  const { q, name, tuss, match, sort, order, limit, offset, fields } =
    request.query;

  let data = searchTussAdvanced({ q, name, tuss, match, sort, order });

  // fields projection (comma-separated)
  const fieldList =
    typeof fields === 'string' && fields.trim().length > 0
      ? fields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : null;

  if (fieldList) {
    data = data.map((item) => project(item, fieldList));
  }

  // Pagination support
  let limitNum;
  let offsetNum = 0;
  if (typeof limit === 'string') {
    const parsed = Number.parseInt(limit, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limitNum = parsed;
    }
  }
  if (typeof offset === 'string') {
    const parsed = Number.parseInt(offset, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      offsetNum = parsed;
    }
  }

  const total = Array.isArray(data) ? data.length : 0;
  let items = data;
  if (typeof limitNum === 'number') {
    items = items.slice(offsetNum, offsetNum + limitNum);
  } else if (offsetNum > 0) {
    items = items.slice(offsetNum);
  }

  return response.status(200).json({
    total,
    limit: typeof limitNum === 'number' ? limitNum : null,
    offset: offsetNum,
    items,
  });
}

export default app().get(TussSearchAdvanced);
