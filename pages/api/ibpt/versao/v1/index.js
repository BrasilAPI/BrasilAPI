import app from '@/app';

import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';

import { getVersao } from '../../../../../services/ibpt';

const action = async (request, response) => {
  try {
    const versao = await getVersao();

    response.status(200).json(versao);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar versão ibpt.',
      type: 'IBPT_VERSAO_INTERNAL',
    });
  }
};

export default app({ cache: 86400 }).get(action);
