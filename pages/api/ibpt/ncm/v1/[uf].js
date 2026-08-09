import app from '@/app';

import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';

import { getNcmIbpt, SIGLAS_UF } from '../../../../../services/ibpt';

const action = async (request, response) => {
  try {
    if (!request.query.uf) {
      throw new BadRequestError({
        message: 'UF não enviada.',
        type: 'IBPT_NCM_BAD_REQUEST',
      });
    }

    const uf = request.query.uf.toUpperCase();

    if (!SIGLAS_UF.includes(uf)) {
      throw new BadRequestError({
        message: 'UF não encontrada.',
        type: 'IBPT_NCM_BAD_REQUEST',
      });
    }

    const aliquotas = await getNcmIbpt({ uf });

    response.status(200).json(aliquotas);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar alíquotas ncm.',
      type: 'IBPT_NCM_INTERNAL',
    });
  }
};

export default app({ cache: 86400 }).get(action);
