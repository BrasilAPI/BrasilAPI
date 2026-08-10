import { listPositionsByMunicipality } from '@/services/eleicoes/cargos-por-municipio';
import BadRequestError from '@/errors/BadRequestError';

export default async function PositionsByMunicipality(request, response) {
  const { election, municipality } = request.query;
  try {
    const positions = await listPositionsByMunicipality(election, municipality);

    return response.status(200).json(positions);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return response.status(400).json({
        message: error.message,
        type: error.type,
        name: error.name,
      });
    }

    if (error.name === 'PositionsByMunicipalityPromiseError')
      return response.status(500).json({
        message: 'Erro ao buscar cargos por município.',
        type: 'positions_by_municipality_error',
        name: error.name,
      });

    throw error;
  }
}
