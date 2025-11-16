import { searchCandidate } from '@/services/eleicoes';

export default async function SearchCandidate(request, response) {
  const { eleicao, ano, municipio, candidato } = request.query;

  try {
    const candidatoData = await searchCandidate(
      eleicao,
      ano,
      municipio,
      candidato
    );

    return response.status(200).json(candidatoData);
  } catch (error) {
    if (error.name === 'CandidateNotFoundError') {
      return response.status(404).json({
        message: 'Candidato não encontrado.',
        type: 'candidate_not_found',
        name: error.name,
      });
    }

    throw error;
  }
}
