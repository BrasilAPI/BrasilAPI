import app from '@/app';

import NotFoundError from '@/errors/NotFoundError';
import { getExchangesData } from '../../../../../services/cvm/corretoras';

const action = async (request, response) => {
  const exchangeCode = request.query.cnpj.replace(/\D/gim, '');

  const allExchangesData = await getExchangesData();

  const exchangeData = allExchangesData.find(
    ({ cnpj }) => cnpj === exchangeCode
  );

  if (!exchangeData) {
    throw new NotFoundError({
      message: 'CNPJ não encontrado',
      type: 'CNPJ_NOT_FOUND',
    });
  }

  response.status(200).json(exchangeData);
};

export default app({ cache: 86400 }).get(action);
