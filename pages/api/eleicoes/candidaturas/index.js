import { listarCandidaturasMunicipio } from '@/services/eleicoes/candidaturas';

export default async function Candidaturas(request, response) {
  const { election, year, municipality, position } = request.query;

  try {
    const candidaturas = await listarCandidaturasMunicipio(
      election,
      year,
      municipality,
      position
    );

    return response.status(200).json(candidaturas);
  } catch (error) {
    if (error.name === 'CandidaturasPromiseError') {
      return response.status(500).json({
        message: 'Erro ao buscar candidaturas.',
        type: 'candidaturas_error',
        name: error.name,
      });
    }

    throw error;
  }
}
