const uruDaysByYear = {
    2023: '2023-06-13'
  };
  
  const spDaysByYear = {
    2023: '2023-07-09'
  };
  
  const goodFridayDaysByYear = {
    2023: '2023-04-07'
  };
  
  const uruHolidaysName = [
    'Dia de Santo Antônio'
  ];
  
  const spHolidaysName = [
    'Revolução Constitucionalista'
  ];
  
  const goodFridayHolidayName = [
    'Sexta-Feira Santa'
  ];
  
  const fixedHolidaysName = [
    'Ano Novo',
    'Dia de Tiradentes',
    'Dia do Trabalho',
    'Nossa Senhora Aparecida',
    'Dia de Finados',
    'Proclamação da República',
    'Independência do Brasil',
    'Natal',
  ];
  
  const getGoodFridayHoliday = (year, holidaysName = goodFridayHolidayName) =>
    [
        {
            date: goodFridayDaysByYear[year],
            name: 'Sexta-Feira Santa',
            type: 'Feriado Nacional',
        }
    ].filter(({ name }) => holidaysName.includes(name));
  
  
  const getUruHoliday = (year, holidaysName = uruHolidaysName) =>
    [
        {
            date: uruDaysByYear[year],
            name: 'Dia de Santo Antônio',
            type: 'Feriado Municipal',
        }
    ].filter(({ name }) => holidaysName.includes(name));
  
  const getSpHoliday = (year, holidaysName = spHolidaysName) =>
    [
        {
            date: spDaysByYear[year],
            name: 'Revolução Constitucionalista',
            type: 'Feriado Estadual',
        }
    ].filter(({ name }) => holidaysName.includes(name));
  
  const getFixedHolidays = (year, holidaysName = fixedHolidaysName) =>
    [
        {
            date: `${year}-01-01`,
            name: 'Ano Novo',
            type: 'Feriado Nacional',
        },
        {
            date: `${year}-04-21`,
            name: 'Dia de Tiradentes',
            type: 'Feriado Nacional',
        },
        {
            date: `${year}-05-01`,
            name: 'Dia do Trabalho',
            type: 'Feriado Nacional',
        },
        {
            date: `${year}-09-07`,
            name: 'Independência do Brasil',
            type: 'Feriado Nacional',
        },
        {
            date: `${year}-10-12`,
            name: 'Nossa Senhora Aparecida',
            type: 'Feriado Nacional',
        },
        {
            date: `${year}-11-02`,
            name: 'Dia de Finados',
            type: 'Feriado Nacional',
        },
        {
            date: `${year}-11-15`,
            name: 'Proclamação da República',
            type: 'Feriado Nacional',
        },
        {
            date: `${year}-12-25`,
            name: 'Natal',
            type: 'Feriado Nacional',
        },
    ].filter(({ name }) => holidaysName.includes(name));
  
  module.exports = {
    getUruHoliday,
    getSpHoliday,
    getGoodFridayHoliday,
    getFixedHolidays
  };