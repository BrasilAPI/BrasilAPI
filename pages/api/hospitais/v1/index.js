import app from '@/app';
import { getHospitais, getSnapshotMetadata } from '@/services/hospitais';
import {
  parseAtendimento,
  parsePaginacao,
  parseUf,
  parseVertical,
} from '@/services/hospitais/query';

async function listarHospitais(request, response) {
  const { vertical, uf, municipio, atendimento, q } = request.query;

  const encontrados = getHospitais({
    vertical: parseVertical(vertical),
    uf: parseUf(uf),
    municipio,
    atendimento: parseAtendimento(atendimento),
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
