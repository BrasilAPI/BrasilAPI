import { listPositionsByMunicipality } from '@/services/eleicoes/cargos-por-municipio';

export default async function PositionsByMunicipality(request, response) {
  const { election, municipality } = request.query;
  try {
    const positions = await listPositionsByMunicipality(election, municipality);

    return response.status(200).json(positions);
  } catch (error) {
    if (error.name === 'PositionsByMunicipalityPromiseError')
      return response.status(500).json({
        message: 'Erro ao buscar cargos por município.',
        type: 'positions_by_municipality_error',
        name: error.name,
      });

    throw error;
  }
}
