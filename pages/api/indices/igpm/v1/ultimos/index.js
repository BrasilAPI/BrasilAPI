import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';
import BaseError from '@/errors/BaseError';
import { getIgpmByLastNRecords } from '@/services/indices/igpm';
import { bcbSgsCodes } from '../../../codes';

const action = async (request, response) => {
  try {
    const { limit } = request.query;

    const monthLimit = +limit;

    if (!Number.isSafeInteger(monthLimit) || !Number.isFinite(monthLimit)) {
      throw new BadRequestError({
        message: 'Limite inválido, informe um número maior ou igual a 1',
        type: 'bad_request',
      });
    }

    if (monthLimit <= 0) {
      throw new BadRequestError({
        message: 'Limite inválido, informe um número maior ou igual a 1',
        type: 'bad_request',
      });
    }

    const igpmList = await getIgpmByLastNRecords(bcbSgsCodes.igpm, limit);

    response.status(200);
    return response.json(igpmList);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      status: 500,
      type: 'INTERNAL',
      message: 'Erro ao obter os dados do BCB',
    });
  }
};

export default app().get(action);
