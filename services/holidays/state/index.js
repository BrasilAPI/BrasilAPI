import NotFoundError from '@/errors/NotFoundError';
import getStatewideHolidays from './statewideHolidays';
import { sortByDate } from '..';

export default function getStateHolidays(uf, year) {
  console.log({
    holidays: getStatewideHolidays(year).map(
      (e) => e.uf
      // (holiday) => holiday.uf === uf.toUpperCase()
    ),
  });
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
