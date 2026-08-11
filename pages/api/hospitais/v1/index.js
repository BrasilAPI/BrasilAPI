import app from '@/app';
import { getHospitais, getSnapshotMetadata } from '@/services/hospitais';
import {
  parseAtendimentos,
  parsePaginacao,
  parseUf,
  parseVertical,
} from '@/services/hospitais/query';

async function listarHospitais(request, response) {
  const { vertical, uf, municipio, q } = request.query;

  const encontrados = getHospitais({
    vertical: parseVertical(vertical),
    uf: parseUf(uf),
    municipio,
    atendimentos: parseAtendimentos(request.query),
    q,
  });

  const { limit, offset } = parsePaginacao(request.query);

  return response.status(200).json({
    total: encontrados.length,
    limit,
    offset,
    ...getSnapshotMetadata(),
    items: encontrados.slice(offset, offset + limit),
  });
}

export default app({ cache: 86400 }).get(listarHospitais);
