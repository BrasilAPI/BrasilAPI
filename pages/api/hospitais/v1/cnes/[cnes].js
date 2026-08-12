import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import { getHospitaisPorCnes, getSnapshotMetadata } from '@/services/hospitais';

async function buscarPorCnes(request, response) {
  const { cnes } = request.query;

  if (!/^\d{1,11}$/.test(String(cnes))) {
    throw new BadRequestError({
      message:
        'CNES inválido. Informe apenas os dígitos do código do estabelecimento (ex: 2077485).',
      type: 'validation_error',
    });
  }

  const encontrados = getHospitaisPorCnes(cnes);

  if (encontrados.length === 0) {
    throw new NotFoundError({
      message: `Nenhum hospital com CNES '${cnes}' nos programas cobertos por esta API. O estabelecimento pode existir no CNES sem estar habilitado nas verticais listadas em /api/hospitais/v1/opcoes.`,
      type: 'not_found',
    });
  }

  return response.status(200).json({
    total: encontrados.length,
    ...getSnapshotMetadata(),
    items: encontrados,
  });
}

export default app({ cache: 86400 }).get(buscarPorCnes);
