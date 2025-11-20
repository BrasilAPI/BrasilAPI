import NotFoundError from '@/errors/NotFoundError';

/**
 * Converte uma data em string para o nome do dia da semana em português
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {string} Nome do dia da semana
 */
export function getWeekdayName(dateString) {
  const weekdays = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];

  const date = new Date(dateString + 'T12:00:00');
  return weekdays[date.getDay()];
}

/**
 * Tabela da lua cheia de Páscoa, valida entre 1900 e 2199, inclusive.
 * Contendo mês (indexado em 0) e dia.
 */
function getPascalFullMoonDates() {
  return [
    [3, 14],
    [3, 3],
    [2, 23],
    [3, 11],
    [2, 31],
    [3, 18],
    [3, 8],
    [2, 28],
    [3, 16],
    [3, 5],
    [2, 25],
    [3, 13],
    [3, 2],
    [2, 22],
    [3, 10],
    [2, 30],
    [3, 17],
    [3, 7],
    [2, 27],
  ];
}

/**
 * @param Date date
 * @return string
 */
function formatDate(date) {
  return date.toISOString().substr(0, 10);
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

  const pascalFullMoonMonthDay = getPascalFullMoonDates();
  const [refMonth, refDay] = pascalFullMoonMonthDay[year % 19];
  const movingDate = new Date(year, refMonth, refDay);
  const holidays = [];
  movingDate.setDate(movingDate.getDate() + 7 - movingDate.getDay());
  const easterDate = formatDate(movingDate);
  holidays.push({
    date: easterDate,
    name: 'Páscoa',
    type: 'national',
    weekday: getWeekdayName(easterDate),
  });
  movingDate.setDate(movingDate.getDate() - 2);
  const goodFridayDate = formatDate(movingDate);
  holidays.push({
    date: goodFridayDate,
    name: 'Sexta-feira Santa',
    type: 'national',
    weekday: getWeekdayName(goodFridayDate),
  });
  movingDate.setDate(movingDate.getDate() - 45);
  const carnavalDate = formatDate(movingDate);
  holidays.push({
    date: carnavalDate,
    name: 'Carnaval',
    type: 'national',
    weekday: getWeekdayName(carnavalDate),
  });
  movingDate.setDate(movingDate.getDate() + 107);
  const corpusChristiDate = formatDate(movingDate);
  holidays.push({
    date: corpusChristiDate,
    name: 'Corpus Christi',
    type: 'national',
    weekday: getWeekdayName(corpusChristiDate),
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
    ['01-01', 'Confraternização mundial'],
    ['04-21', 'Tiradentes'],
    ['05-01', 'Dia do trabalho'],
    ['09-07', 'Independência do Brasil'],
    ['10-12', 'Nossa Senhora Aparecida'],
    ['11-02', 'Finados'],
    ['11-15', 'Proclamação da República'],
    ['12-25', 'Natal'],
  ];

  if (year >= 2024) {
    fixedHolidays.splice(fixedHolidays.length - 1, 0, [
      '11-20',
      'Dia da consciência negra',
    ]);
  }

  return fixedHolidays.map(([date, name]) => {
    const fullDate = `${year}-${date}`;
    return {
      date: fullDate,
      name,
      type: 'national',
      weekday: getWeekdayName(fullDate),
    };
  });
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
