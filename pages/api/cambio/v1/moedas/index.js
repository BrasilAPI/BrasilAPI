import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getCurrency } from '@/services/cambio';

const action = async (request, response) => {
  try {
    const currency = await getCurrency();

    response.status(200).json(currency);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao buscar moedas.',
      type: 'moedas_error',
    });
  }
};

export default app().get(action);
