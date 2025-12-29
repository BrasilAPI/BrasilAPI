import app from '@/app';

import BaseError from '@/errors/BaseError';

import InternalError from '@/errors/InternalError';
import { getFundDetails } from '@/services/cvm/fundos';

const action = async (request, response) => {
  try {
    const cnpj = request.query.cnpj.replace(/\D/gim, '');
    const fundDetails = await getFundDetails(cnpj);
    response.status(200).json(fundDetails);
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
