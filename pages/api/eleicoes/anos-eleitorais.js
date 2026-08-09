import { listElectionYears } from '@/services/eleicoes';

export default async function AnosEleitorais(request, response) {
  try {
    const anosEleitorais = await listElectionYears();

    return response.status(200).json(anosEleitorais);
  } catch (error) {
    if (error.name === 'ElectionYearsPromiseError') {
      return response.status(500).json({
        message: 'Erro ao buscar anos eleitorais.',
        type: 'election_years_error',
        name: error.name,
      });
    }

    throw error;
  }
}
