import app from '@/app';

import BaseError from '@/errors/BaseError';

import InternalError from '@/errors/InternalError';
import { getExchangesData } from '../../../../../services/cvm/corretoras';

const action = async (request, response) => {
  try {
    const allExchangesData = await getExchangesData();
    response.status(200).json(allExchangesData);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre corretora',
      type: 'exchange_error',
      name: 'EXCHANGE_INTERNAL',
    });
  }
};

export default app({ cache: 86400 }).get(action);
