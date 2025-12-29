import app from '@/app';

import BaseError from '@/errors/BaseError';

import InternalError from '@/errors/InternalError';
import { getFunds } from '@/services/cvm/fundos';

const action = async (request, response) => {
  try {
    const { page, size } = request.query;
    const fundData = await getFunds(size, page);
    response.status(200).json(fundData);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre fundos',
      type: 'exchange_error',
      name: 'EXCHANGE_INTERNAL',
    });
  }
};

export default app({ cache: 86400 }).get(action);
