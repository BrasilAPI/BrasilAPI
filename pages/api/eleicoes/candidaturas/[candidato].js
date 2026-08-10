import { searchCandidate } from '@/services/eleicoes';
import BadRequestError from '@/errors/BadRequestError';

export default async function SearchCandidate(request, response) {
  const { election, year, municipality, candidato } = request.query;

  try {
    const candidatoData = await searchCandidate(
      election,
      year,
      municipality,
      candidato
    );

    return response.status(200).json(candidatoData);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return response.status(400).json({
        message: error.message,
        type: error.type,
        name: error.name,
      });
    }

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
