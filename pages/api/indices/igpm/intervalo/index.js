import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { isAfter, isBefore, isValidDate, parseToDate } from '@/services/date';
import { getIgpmByPeriod } from '@/services/indices/igpm';

const action = async (request, response) => {
  // eslint-disable-next-line camelcase
  const { initial_date, final_date } = request.query;

  const initialDate = parseToDate(initial_date, 'DD/MM/YYYY');
  const finalDate = parseToDate(final_date, 'DD/MM/YYYY');

  if (!isValidDate(initialDate) || !isValidDate(finalDate)) {
    throw new BadRequestError({
      message: 'Intervalo de datas inválido, informe um intervalo correto',
    });
  }

  if (isBefore(finalDate, initialDate) || isAfter(initialDate, finalDate)) {
    throw new BadRequestError({
      message: 'Intervalo de datas inválido, informe um intervalo correto',
    });
  }

  const igpmList = await getIgpmByPeriod(initial_date, final_date);

  response.status(200);
  return response.json(igpmList);
};

export default app().get(action);
