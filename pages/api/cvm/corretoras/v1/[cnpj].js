import app from '@/app';

import BaseError from '@/errors/BaseError';
import NotFoundError from '@/errors/NotFoundError';
import InternalError from '@/errors/InternalError';

import { getExchangesData } from '../../../../../services/cvm/corretoras';

const action = async (request, response) => {
  try {
    const exchangeCode = request.query.cnpj.replace(/\D/gim, '');

    const allExchangesData = await getExchangesData();

    const exchangeData = allExchangesData.find(
      ({ cnpj }) => cnpj === exchangeCode
    );

    if (!exchangeData) {
      throw new NotFoundError({
        message: 'Nenhuma corretora localizada',
        type: 'exchange_error',
        name: 'EXCHANGE_NOT_FOUND',
      });
    }

    response.status(200).json(exchangeData);
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
