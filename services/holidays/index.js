import NotFoundError from '@/errors/NotFoundError';

function getStateHolidays(year, state) {
  if (!state) {
    return [];
  }
  // Mapa simples de feriados estaduais por UF
  const stateHolidaysMap = {
    AC: [{ monthDay: '01-23', name: 'Dia do Evangélico' }],
    AL: [{ monthDay: '06-24', name: 'São João' }],
    AM: [
      {
        monthDay: '09-05',
        name: 'Elevação do Amazonas à Categoria de Província',
      },
    ],
    AP: [{ monthDay: '09-13', name: 'Criação do Território Federal do Amapá' }],
    BA: [{ monthDay: '07-02', name: 'Independência da Bahia' }],
    CE: [{ monthDay: '03-19', name: 'Dia de São José (Padroeiro do Ceará)' }],
    DF: [{ monthDay: '04-21', name: 'Aniversário de Brasília' }],
    ES: [{ monthDay: '10-28', name: 'Dia do Servidor Público' }],
    GO: [{ monthDay: '07-26', name: 'Fundação da Cidade de Goiás' }],
    MA: [{ monthDay: '07-28', name: 'Adesão do Maranhão à Independência' }],
    MG: [{ monthDay: '04-21', name: 'Execução de Tiradentes (feriado em MG)' }],
    MS: [
      { monthDay: '10-11', name: 'Criação do Estado do Mato Grosso do Sul' },
    ],
    MT: [{ monthDay: '11-29', name: 'Consciência Negra (feriado estadual)' }],
    PA: [{ monthDay: '08-15', name: 'Adesão do Pará à Independência' }],
    PB: [{ monthDay: '08-05', name: 'Fundação da Paraíba' }],
    PE: [{ monthDay: '03-06', name: 'Revolução Pernambucana' }],
    PI: [{ monthDay: '10-19', name: 'Dia do Piauí' }],
    PR: [{ monthDay: '12-19', name: 'Emancipação Política do Paraná' }],
    RJ: [{ monthDay: '01-20', name: 'São Sebastião (padroeiro do RJ)' }],
    RN: [{ monthDay: '10-03', name: 'Mártires de Cunhaú e Uruaçu' }],
    RO: [{ monthDay: '01-04', name: 'Criação do Estado de Rondônia' }],
    RR: [{ monthDay: '10-05', name: 'Criação do Estado de Roraima' }],
    RS: [{ monthDay: '09-20', name: 'Revolução Farroupilha' }],
    SC: [{ monthDay: '08-11', name: 'Dia do Estado de Santa Catarina' }],
    SE: [{ monthDay: '07-08', name: 'Emancipação Política de Sergipe' }],
    SP: [{ monthDay: '01-25', name: 'Aniversário da Cidade de São Paulo' }],
    TO: [{ monthDay: '01-01', name: 'Instalação do Estado do Tocantins' }],
  };

  const definition = stateHolidaysMap[state];

  if (!definition) {
    throw new Error('Estado inválido');
  }
  return definition.map((holiday) => ({
    date: `${year}-${holiday.monthDay}`,
    name: holiday.name,
    type: 'state',
    state,
  }));
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
  holidays.push({
    date: formatDate(movingDate),
    name: 'Páscoa',
    type: 'national',
  });
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

export default function getHolidays(year, state) {
  const easterHolidays = getEasterHolidays(year);
  const nationalHolidays = getNationalHolidays(year);
  const stateHolidays = getStateHolidays(year, state);

  return sortByDate([...easterHolidays, ...nationalHolidays, ...stateHolidays]);
}
