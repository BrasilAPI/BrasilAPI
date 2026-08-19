import app from '@/app';
import { getCiatox, getSnapshotMetadata } from '@/services/hospitais';
import { parseUf } from '@/services/hospitais/query';

async function listarCiatox(request, response) {
  const encontrados = getCiatox({ uf: parseUf(request.query.uf) });

  return response.status(200).json({
    total: encontrados.length,
    ...getSnapshotMetadata(),
    items: encontrados,
  });
}

export default app({ cache: 86400 }).get(listarCiatox);
