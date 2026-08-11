import app from '@/app';
import { getHospitais, getSnapshotMetadata } from '@/services/hospitais';
import {
  paginar,
  parseAtendimento,
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

  const { items, ...paginacao } = paginar(encontrados, request.query);

  return response.status(200).json({
    ...paginacao,
    ...getSnapshotMetadata(),
    items,
  });
}

export default app({ cache: 86400 }).get(listarHospitais);
