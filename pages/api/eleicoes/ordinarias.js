import { listOrdinaryElections } from '@/services/eleicoes';

export default async function OrdinaryElections(request, response) {
  try {
    const elections = await listOrdinaryElections();

    return response.status(200).json(elections);
  } catch (error) {
    if (error.name === 'OrdinaryElectionsPromiseError') {
      return response.status(500).json({
        message: 'Erro ao buscar eleições ordinarias.',
        type: 'ordinaries_error',
        name: error.name,
      });
    }

    throw error;
  }
}
