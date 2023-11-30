import NotFoundError from '@/errors/NotFoundError';
import getStatewideHolidays from './statewideHolidays';
import { sortByDate } from '..';

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
    throw new NotFoundError({
      name: 'NotFoundError',
      message: `Não há registro de feriados para o estado ${uf.toUpperCase()}`,
      type: 'not_found_state_holidays_error',
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
