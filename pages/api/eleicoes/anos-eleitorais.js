import { listarAnosEleitorais } from '@/services/eleicoes';

export default async function AnosEleitorais(request, response) {
  try {
    const anosEleitorais = await listarAnosEleitorais();

    return response.status(200).json(anosEleitorais);
  } catch (error) {
    if (error.name === 'AnosEleitoraisPromiseError') {
      return response.status(500).json({
        message: 'Erro ao buscar anos eleitorais.',
        type: 'anos_eleitorais_error',
        name: error.name,
      });
    }
  }
}
