import NotFoundError from '@/errors/NotFoundError';
import getStatewideHolidays from './statewideHolidays';
import { sortByDate } from '..';
import BadRequestError from '@/errors/BadRequestError';

export default function getStateHolidays(uf, year) {
  if (year < 1900 || year > 2199) {
    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Ano fora do intervalo suportado entre 1900 e 2199.',
      type: 'feriados_range_error',
    });
  }

  const { holidays } = getStatewideHolidays(year).find(
    (holiday) => holiday.uf === uf.toUpperCase()
  );

  if (!holidays) {
    throw new BadRequestError({
      name: 'NotFoundError',
      message: `Uf inexistente`,
      type: 'state_does_not_exist_error',
    });
  }

  const holidaysFormated = holidays.map((holiday) => {
    return {
      date: `${year}-${holiday.date}`,
      name: holiday.name,
      type: 'state',
    };
  });

  return sortByDate(holidaysFormated);
}
