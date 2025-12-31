import { listCandidatureByMunicipality } from '@/services/eleicoes/candidaturas';

export default async function Candidature(request, response) {
  const { election, year, municipality, position } = request.query;

  try {
    const candidaturas = await listCandidatureByMunicipality(
      election,
      year,
      municipality,
      position
    );

    return response.status(200).json(candidaturas);
  } catch (error) {
    if (error.name === 'CandidaturesPromiseError') {
      return response.status(500).json({
        message: 'Erro ao buscar candidaturas.',
        type: 'candidatures_error',
        name: error.name,
      });
    }

    throw error;
  }
}
