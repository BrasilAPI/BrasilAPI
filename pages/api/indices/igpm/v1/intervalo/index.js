import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { isAfter, isBefore, isValidDate, parseToDate } from '@/services/date';
import { getIgpmByPeriod } from '@/services/indices/igpm';
import { codes } from '../../../codes';

const action = async (request, response) => {
  // eslint-disable-next-line camelcase
  const { initial_date, final_date } = request.query;

  const initialDate = parseToDate(initial_date, 'DD/MM/YYYY');
  const finalDate = parseToDate(final_date, 'DD/MM/YYYY');

  if (!isValidDate(initialDate) || !isValidDate(finalDate)) {
    throw new BadRequestError({
      message: 'Intervalo de datas inválido, informe um intervalo correto',
      type: 'INTERNAL',
      name: 'IGPM_LIST_ERROR',
    });
  }

  if (isBefore(finalDate, initialDate) || isAfter(initialDate, finalDate)) {
    throw new BadRequestError({
      message: 'Intervalo de datas inválido, informe um intervalo correto',
      type: 'INTERNAL',
      name: 'IGPM_LIST_ERROR',
    });
  }

  const igpmList = await getIgpmByPeriod(codes.igpm, initial_date, final_date);

  response.status(200);
  return response.json(igpmList);
};

export default app().get(action);
