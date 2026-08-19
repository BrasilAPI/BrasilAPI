import app from '@/app';
import {
  getHospitaisProximos,
  getSnapshotMetadata,
} from '@/services/hospitais';
import { resolverOrigem } from '@/services/hospitais/origem';
import {
  METROS_POR_KM,
  paginar,
  parseAtendimento,
  parseRaioEmMetros,
  parseVertical,
} from '@/services/hospitais/query';

const LIMIT_PADRAO_PROXIMOS = 50;

async function listarHospitaisProximos(request, response) {
  const origem = await resolverOrigem(request.query);
  const raioEmMetros = parseRaioEmMetros(request.query.raio_km);

  const encontrados = getHospitaisProximos({
    ...origem,
    raioEmMetros,
    vertical: parseVertical(request.query.vertical),
    atendimento: parseAtendimento(request.query.atendimento),
  });

  const { items, ...paginacao } = paginar(
    encontrados,
    request.query,
    LIMIT_PADRAO_PROXIMOS
  );

  return response.status(200).json({
    ...paginacao,
    origem,
    raio_km: raioEmMetros / METROS_POR_KM,
    ...getSnapshotMetadata(),
    items,
  });
}

export default app({ cache: 86400 }).get(listarHospitaisProximos);
