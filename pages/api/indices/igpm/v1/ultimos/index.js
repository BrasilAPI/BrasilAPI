import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';
import BaseError from '@/errors/BaseError';
import { getIgpmByLastNRecords } from '@/services/indices/igpm';
import { bcbSgsCodes } from '../../../codes';

const action = async (request, response) => {
  try {
    const { limit } = request.query;

    if (Number.isNaN(limit) || !Number.isFinite(limit)) {
      throw new BadRequestError({
        message: 'Limite inválido, informe um número maior ou igual a 1',
      });
    }

    if (!limit) {
      throw new BadRequestError({
        message: 'Limite inválido, informe um número maior ou igual a 1',
      });
    }

    if (limit <= 0) {
      throw new BadRequestError({
        message: 'Limite inválido, informe um número maior ou igual a 1',
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
    });
  }
};

export default app().get(action);
