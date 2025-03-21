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

const easterHolidaysName = [
  'Páscoa',
  'Sexta-feira Santa',
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

const getEasterHolidays = (year, holidaysName = easterHolidaysName) =>
  [
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
  ].filter(({ name }) => holidaysName.includes(name));

const getFixedHolidays = (year, holidaysName = fixedHolidaysName) => {
  const holidays = [
    {
      date: `${year}-01-01`,
      name: 'Confraternização mundial',
      type: 'national',
    },
    {
      date: `${year}-04-21`,
      name: 'Tiradentes',
      type: 'national',
    },
    {
      date: `${year}-05-01`,
      name: 'Dia do trabalho',
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
      name: 'Dia da consciência negra',
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
