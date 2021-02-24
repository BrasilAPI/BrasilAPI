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
    throw new Error('Cannot calculate holidays.');
  }
  const pascalFullMoonMonthDay = getPascalFullMoonDates();
  const [refMonth, refDay] = pascalFullMoonMonthDay[year % 19];
  const movingDate = new Date(year, refMonth, refDay);
  const holidays = [];
  movingDate.setDate(movingDate.getDate() + 7 - movingDate.getDay());
  holidays.push({
    date: formatDate(movingDate),
    name: 'Páscoa',
    type: 'national',
  });
  movingDate.setDate(movingDate.getDate() - 2);
  // Sexta feira Santa / Paixão de Cristo não é feriado nacional
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
    ['01-01', 'Confraternização mundial'],
    ['04-21', 'Tiradentes'],
    ['05-01', 'Dia do trabalho'],
    ['09-07', 'Independência do Brasil'],
    ['10-12', 'Nossa Senhora Aparecida'],
    ['11-02', 'Finados'],
    ['11-15', 'Proclamação da República'],
    ['12-25', 'Natal'],
  ];
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
