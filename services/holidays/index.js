import NotFoundError from '@/errors/NotFoundError';

/**
 * @param Date date
 * @return string
 */
function formatDate(date) {
  return date.toISOString().substr(0, 10);
}

/**
 * Cálculo da data do feriado de Páscoa
 */
function getEasterDay(year) {
  /* facilita obter o quociente e o resto da divisão */
  const div_mod = (dividend, divisor) => [Math.floor(dividend / divisor), dividend % divisor];
  
  const a = year % 19;
  const [b, c] = div_mod(year, 100);
  const h = (19 * a + b - Math.floor(b / 4) - Math.floor((b - (b + 8) / 25 + 1) / 3) + 15) % 30;
  const [i, k] = div_mod(c, 4);
  const l = (32 + 2 * (b % 4) + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const [month, day] = div_mod(h + l - 7 * m + 114, 31);
  return new Date(year, month-1, day+1);
}

/**
 * Cálculo de feriados móveis baseados na Páscoa
 *
 * @see https://en.wikipedia.org/wiki/Computus
 */
export function getEasterHolidays(year) {
  if (year < 1900 || year > 2199) {
    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Ano fora do intervalo suportado entre 1900 e 2199.',
      type: 'feriados_range_error',
    });
  }
  
  const holidays = [];
  
  const easterDate = getEasterDay(year);
  holidays.push({
    date: formatDate(easterDate),
    name: 'Páscoa',
    type: 'national',
  });
  
  const movingDate = new Date(+easterDate);

  movingDate.setDate(movingDate.getDate() - 2);
  holidays.push({
    date: formatDate(movingDate),
    name: 'Sexta-feira Santa',
    type: 'national',
  });
  
  movingDate.setDate(movingDate.getDate() - 45);
  holidays.push({
    date: formatDate(movingDate),
    name: 'Carnaval',
    type: 'national',
  });
  
  movingDate.setDate(movingDate.getDate() + 107);
  holidays.push({
    date: formatDate(movingDate),
    name: 'Corpus Christi',
    type: 'national',
  });
  
  return holidays;
}

/**
 * Combina feriados móveis e fixos.
 *
 * Lei n° 6.802 de 30/06/1980
 * - Nossa Senhora Aparecida
 * Lei n° 662 de 06/04/1949
 * - Confraternização mundial
 * - Tiradentes
 * - Dia do trabalho
 * - Independência do Brasil
 * - Finados
 * - Proclamação da República
 * - Natal
 *
 * Referência de https://github.com/pagarme/business-calendar/tree/master/src/brazil
 */
export function getNationalHolidays(year) {
  const fixedHolidays = [
    ['01-01', 'Confraternização Mundial'],
    ['04-21', 'Tiradentes'],
    ['05-01', 'Dia do Trabalho'],
    ['09-07', 'Independência do Brasil'],
    ['10-12', 'Nossa Senhora Aparecida'],
    ['11-02', 'Finados'],
    ['11-15', 'Proclamação da República'],
    ['12-25', 'Natal'],
  ];

  if (year >= 2024) {
    fixedHolidays.splice(fixedHolidays.length - 1, 0, 
      ['11-20', 'Dia da Consciência Negra']
    );
  }

  return fixedHolidays.map(([date, name]) => ({
    date: `${year}-${date}`,
    name,
    type: 'national',
  }));
}

function sortByDate(holidays) {
  return holidays.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  });
}

export default function getHolidays(year) {
  const easterHolidays = getEasterHolidays(year);
  const nationalHolidays = getNationalHolidays(year);
  return sortByDate([...easterHolidays, ...nationalHolidays]);
}
