const carnavalDaysByYear = {
  2020: '2020-02-25',
  2010: '2010-02-16',
};

const pascoaDaysByYear = {
  2020: '2020-04-12',
  2019: '2019-04-21',
  2010: '2010-04-04',
};

const goodFridayDaysByYear = {
  2020: '2020-04-10',
  2019: '2019-04-19',
  2010: '2010-04-02',
};

const corpusChristiDaysByYear = {
  2020: '2020-06-11',
  2010: '2010-06-03',
};

const easterHolidaysName = [
  'Carnaval',
  'Páscoa',
  'Sexta-feira Santa',
  'Corpus Christi',
];
const fixedHolidaysName = [
  'Confraternização mundial',
  'Tiradentes',
  'Dia do trabalho',
  'Independência do Brasil',
  'Nossa Senhora Aparecida',
  'Finados',
  'Proclamação da República',
  'Dia da consciência negra',
  'Natal',
];

const getWeekdayName = (dateString) => {
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
};

const getEasterHolidays = (year, holidaysName = easterHolidaysName) =>
  [
    {
      date: carnavalDaysByYear[year],
      name: 'Carnaval',
      type: 'national',
      weekday: getWeekdayName(carnavalDaysByYear[year]),
    },
    {
      date: pascoaDaysByYear[year],
      name: 'Páscoa',
      type: 'national',
      weekday: getWeekdayName(pascoaDaysByYear[year]),
    },
    {
      date: goodFridayDaysByYear[year],
      name: 'Sexta-feira Santa',
      type: 'national',
      weekday: getWeekdayName(goodFridayDaysByYear[year]),
    },
    {
      date: corpusChristiDaysByYear[year],
      name: 'Corpus Christi',
      type: 'national',
      weekday: getWeekdayName(corpusChristiDaysByYear[year]),
    },
  ].filter(({ name }) => holidaysName.includes(name));

const getFixedHolidays = (year, holidaysName = fixedHolidaysName) => {
  const holidays = [
    {
      date: `${year}-01-01`,
      name: 'Confraternização mundial',
      type: 'national',
      weekday: getWeekdayName(`${year}-01-01`),
    },
    {
      date: `${year}-04-21`,
      name: 'Tiradentes',
      type: 'national',
      weekday: getWeekdayName(`${year}-04-21`),
    },
    {
      date: `${year}-05-01`,
      name: 'Dia do trabalho',
      type: 'national',
      weekday: getWeekdayName(`${year}-05-01`),
    },
    {
      date: `${year}-09-07`,
      name: 'Independência do Brasil',
      type: 'national',
      weekday: getWeekdayName(`${year}-09-07`),
    },
    {
      date: `${year}-10-12`,
      name: 'Nossa Senhora Aparecida',
      type: 'national',
      weekday: getWeekdayName(`${year}-10-12`),
    },
    {
      date: `${year}-11-02`,
      name: 'Finados',
      type: 'national',
      weekday: getWeekdayName(`${year}-11-02`),
    },
    {
      date: `${year}-11-15`,
      name: 'Proclamação da República',
      type: 'national',
      weekday: getWeekdayName(`${year}-11-15`),
    },
    {
      date: `${year}-12-25`,
      name: 'Natal',
      type: 'national',
      weekday: getWeekdayName(`${year}-12-25`),
    },
  ];

  if (year >= 2024) {
    holidays.splice(holidays.length - 1, 0, {
      date: `${year}-11-20`,
      name: 'Dia da consciência negra',
      type: 'national',
      weekday: getWeekdayName(`${year}-11-20`),
    });
  }

  return holidays.filter(({ name }) => holidaysName.includes(name));
};

const getHolidays = (
  year,
  holidaysName = [...easterHolidaysName, ...fixedHolidaysName]
) => {
  return [
    ...getEasterHolidays(year, holidaysName),
    ...getFixedHolidays(year, holidaysName),
  ].sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  });
};

module.exports = {
  getEasterHolidays,
  getFixedHolidays,
  getHolidays,
};
