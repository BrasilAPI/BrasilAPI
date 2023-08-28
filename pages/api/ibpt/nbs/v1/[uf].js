import app from '@/app';

import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';

import { getNbsIbpt, SIGLAS_UF } from '../../../../../services/ibpt';

const action = async (request, response) => {
  try {
    if (!request.query.uf) {
      throw new BadRequestError({
        message: 'UF não enviada.',
        type: 'IBPT_NBS_BAD_REQUEST',
      });
    }

    const uf = request.query.uf.toUpperCase();

    if (!SIGLAS_UF.includes(uf)) {
      throw new BadRequestError({
        message: 'UF não encontrada.',
        type: 'IBPT_NBS_BAD_REQUEST',
      });
    }

    const aliquotas = await getNbsIbpt({ uf });

    response.status(200).json(aliquotas);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar alíquotas nbs.',
      type: 'IBPT_NBS_INTERNAL',
    });
  }
};

export default app({ cache: 86400 }).get(action);
