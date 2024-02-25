import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getDollarExchange } from '@/services/cambio';

const action = async (request, response) => {
  try {
    console.log(request.query);
    const exchange = await getDollarExchange(request.query);

    response.status(200).json(exchange);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao buscar cotação do dólar.',
      type: 'exchange_error',
    });
  }
};

export default app().get(action);
