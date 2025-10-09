import app from '@/app';
import { searchTussAdvanced } from '@/services/tuss';

async function TussAutocomplete(request, response) {
  const { q, name, tuss, limit } = request.query;

  // default small limit, cap at 20 for autocomplete
  let limitNum = 10;
  if (typeof limit === 'string') {
    const parsed = Number.parseInt(limit, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limitNum = Math.min(parsed, 20);
    }
  }

  // Force prefix match and lightweight fields
  const data = searchTussAdvanced({
    q,
    name,
    tuss,
    match: 'prefix',
    sort: 'tuss',
    order: 'asc',
  })
    .slice(0, limitNum)
    .map((item) => ({
      tuss: item.tuss || item.codigo || item.codigo_tuss,
      name: item.name || item.nome || item.descricao,
    }));

  return response.status(200).json(data);
}

export default app().get(TussAutocomplete);
