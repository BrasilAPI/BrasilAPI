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
  'Confraternização Mundial',
  'Tiradentes',
  'Dia do Trabalho',
  'Independência do Brasil',
  'Nossa Senhora Aparecida',
  'Finados',
  'Proclamação da República',
  'Dia da Consciência Negra',
  'Natal',
];

const getEasterHolidays = (year, holidaysName = easterHolidaysName) =>
  [
    {
      date: carnavalDaysByYear[year],
      name: 'Carnaval',
      type: 'national',
    },
    {
      date: pascoaDaysByYear[year],
      name: 'Páscoa',
      type: 'national',
    },
    {
      date: goodFridayDaysByYear[year],
      name: 'Sexta-feira Santa',
      type: 'national',
    },
    {
      date: corpusChristiDaysByYear[year],
      name: 'Corpus Christi',
      type: 'national',
    },
  ].filter(({ name }) => holidaysName.includes(name));

const getFixedHolidays = (year, holidaysName = fixedHolidaysName) => {
  const holidays = [
    {
      date: `${year}-01-01`,
      name: 'Confraternização Mundial',
      type: 'national',
    },
    {
      date: `${year}-04-21`,
      name: 'Tiradentes',
      type: 'national',
    },
    {
      date: `${year}-05-01`,
      name: 'Dia do Trabalho',
      type: 'national',
    },
    {
      date: `${year}-09-07`,
      name: 'Independência do Brasil',
      type: 'national',
    },
    {
      date: `${year}-10-12`,
      name: 'Nossa Senhora Aparecida',
      type: 'national',
    },
    {
      date: `${year}-11-02`,
      name: 'Finados',
      type: 'national',
    },
    {
      date: `${year}-11-15`,
      name: 'Proclamação da República',
      type: 'national',
    },
    {
      date: `${year}-12-25`,
      name: 'Natal',
      type: 'national',
    },
  ];

  if (year >= 2024) {
    holidays.splice(holidays.length - 1, 0, {
      date: `${year}-11-20`,
      name: 'Dia da Consciência Negra',
      type: 'national',
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
