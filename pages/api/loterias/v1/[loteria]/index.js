import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getUltimoResultado } from '@/services/loterias';

async function getUltimoResultadoLoteria(request, response) {
  try {
    const { loteria } = request.query;

    const resultado = await getUltimoResultado(loteria);

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

export default app().get(getUltimoResultadoLoteria);
