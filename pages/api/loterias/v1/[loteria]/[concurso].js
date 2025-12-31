import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getResultadoPorConcurso } from '@/services/loterias';

async function getResultadoLoteriaPorConcurso(request, response) {
  try {
    const { loteria, concurso } = request.query;

    const resultado = await getResultadoPorConcurso(loteria, concurso);

    return response.status(200).json(resultado);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao buscar resultado da loteria.',
      type: 'loteria_error',
    });
  }
}

export default app().get(getResultadoLoteriaPorConcurso);
