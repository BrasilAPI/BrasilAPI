import app from '@/app';

import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';

import { getLc116Ibpt, SIGLAS_UF } from '../../../../../services/ibpt';

const action = async (request, response) => {
  try {
    if (!request.query.uf) {
      throw new BadRequestError({
        message: 'UF não enviada.',
        type: 'IBPT_LC116_BAD_REQUEST',
      });
    }

    const uf = request.query.uf.toUpperCase();

    if (!SIGLAS_UF.includes(uf)) {
      throw new BadRequestError({
        message: 'UF não encontrada.',
        type: 'IBPT_LC116_BAD_REQUEST',
      });
    }

    const aliquotas = await getLc116Ibpt({ uf });

    response.status(200).json(aliquotas);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar alíquotas LC 116.',
      type: 'IBPT_LC116_INTERNAL',
    });
  }
};

export default app({ cache: 86400 }).get(action);
