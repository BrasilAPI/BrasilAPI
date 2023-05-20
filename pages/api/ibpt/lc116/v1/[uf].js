import app from '@/app';

import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { getLc116Ibpt, SIGLAS_UF } from '../../../../../services/ibpt';

const action = async (request, response) => {
  try {
    if (!request.query.uf) {
      throw new BadRequestError({
        message: 'UF não enviada.',
        type: 'ibpt_lc116_error',
        name: 'IBPT_LC116_BAD_REQUEST',
      });
    }

    const uf = request.query.uf.toUpperCase();

    if (!SIGLAS_UF.includes(uf)) {
      throw new NotFoundError({
        message: 'UF não encontrada.',
        type: 'ibpt_lc116_error',
        name: 'IBPT_LC116_NOT_FOUND',
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
      type: 'ibpt_lc116_error',
      name: 'IBPT_LC116_INTERNAL',
    });
  }
};

export default app({ cache: 7200 }).get(action);
