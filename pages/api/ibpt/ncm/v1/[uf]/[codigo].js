import app from '@/app';

import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { getNcmIbpt, SIGLAS_UF } from '../../../../../../services/ibpt';

const action = async (request, response) => {
  try {
    if (!request.query.uf) {
      throw new BadRequestError({
        message: 'UF não enviada.',
        type: 'IBPT_NCM_BAD_REQUEST',
        name: 'IBPT_NCM_BAD_REQUEST',
      });
    }

    const uf = request.query.uf.toUpperCase();

    if (!SIGLAS_UF.includes(uf)) {
      throw new NotFoundError({
        message: 'UF não encontrada.',
        type: 'IBPT_NCM_NOT_FOUND',
        name: 'IBPT_NCM_NOT_FOUND',
      });
    }

    const { codigo, ex = '' } = request.query;

    if (!codigo) {
      throw new BadRequestError({
        message: 'Codigo não enviado.',
        type: 'IBPT_NCM_BAD_REQUEST',
        name: 'IBPT_NCM_BAD_REQUEST',
      });
    }

    if (codigo.length !== 8) {
      throw new BadRequestError({
        message: 'Codigo do NCM deve ter 8 digitos.',
        type: 'IBPT_NCM_BAD_REQUEST',
        name: 'IBPT_NCM_BAD_REQUEST',
      });
    }

    const aliquotas = await getNcmIbpt({ uf });

    const retorno = aliquotas.find(
      (value) => value.codigo === codigo && value.ex === ex
    );

    if (!retorno) {
      throw new NotFoundError({
        message: 'NCM não encontrado.',
        type: 'IBPT_NCM_NOT_FOUND',
        name: 'IBPT_NCM_NOT_FOUND',
      });
    }

    response.status(200).json(retorno);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar alíquotas ncm.',
      type: 'IBPT_NCM_INTERNAL',
      name: 'IBPT_NCM_INTERNAL',
    });
  }
};

export default app({ cache: 7200 }).get(action);
