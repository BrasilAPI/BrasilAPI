import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { isAfter, isBefore, isValidDate, parseToDate } from '@/services/date';
import { getIgpmByPeriod } from '@/services/indices/igpm';
import { bcbSgsCodes } from '../../../codes';

const action = async (request, response) => {
  try {
    const {
      initial_date: initialDateInterval,
      final_date: finalDateInterval,
    } = request.query;

    const initialDate = parseToDate(initialDateInterval, 'DD-MM-YYYY');
    const finalDate = parseToDate(finalDateInterval, 'DD-MM-YYYY');

    if (!isValidDate(initialDate) || !isValidDate(finalDate)) {
      throw new BadRequestError({
        message: 'Intervalo de datas inválido, informe um intervalo correto',
        type: 'range_error',
        name: 'IGPM_LIST_ERROR',
      });
    }

    if (isBefore(finalDate, initialDate) || isAfter(initialDate, finalDate)) {
      throw new BadRequestError({
        message: 'Intervalo de datas inválido, informe um intervalo correto',
        type: 'range_error',
        name: 'IGPM_LIST_ERROR',
      });
    }

    const igpmList = await getIgpmByPeriod(
      bcbSgsCodes.igpm,
      initialDateInterval,
      finalDateInterval
    );

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
