import { buscarCandidato } from '@/services/eleicoes';

export default async function BuscarCandidato(request, response) {
  const { eleicao, ano, municipio, candidato } = request.query;

  try {
    const candidatoData = await buscarCandidato(
      eleicao,
      ano,
      municipio,
      candidato
    );

    return response.status(200).json(candidatoData);
  } catch (error) {
    if (error.name === 'CandidatoNotFoundError') {
      return response.status(404).json({
        message: 'Candidato não encontrado.',
        type: 'candidato_not_found',
        name: error.name,
      });
    }

    throw error;
  }
}
