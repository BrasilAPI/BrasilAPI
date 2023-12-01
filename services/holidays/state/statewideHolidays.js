const fixedStatewideHolidays = [
  {
    uf: 'AM',
    holidays: [
      {
        date: '09-05',
        name: 'Elevação do Amazonas à categoria de província',
      },
      { date: '11-20', name: 'Dia da Consciência Negra' },
    ],
  },
  {
    uf: 'CE',
    holidays: [
      { date: '03-19', name: 'Dia de São José' },
      { date: '03-25', name: 'Data Magna do Ceará' },
    ],
  },
  {
    uf: 'DF',
    holidays: [
      { date: '04-21', name: 'Fundação de Brasília' },
      { date: '11-30', name: 'Dia do Evangélico' },
    ],
  },
  {
    uf: 'ES',
    holidays: [
      {
        date: '04-10',
        name: 'Dia de Nossa Senhora da Penha (Data Magna do Estado)',
      },
    ],
  },
  {
    uf: 'MA',
    holidays: [
      {
        date: '07-28',
        name: 'Dia da Adesão do Maranhão à Independência do Brasil',
      },
    ],
  },
  {
    uf: 'MT',
    holidays: [{ date: '11-20', name: 'Dia da Consciência Negra' }],
  },
  {
    uf: 'MS',
    holidays: [
      { date: '10-11', name: 'Criação do Estado do Mato Grosso do Sul' },
    ],
  },
  {
    uf: 'GO',
    holidays: [],
  },
  {
    uf: 'AC',
    holidays: [
      { date: '01-20', name: 'Dia do Católico' },
      { date: '01-25', name: 'Dia do Evangélico' },
      { date: '06-15', name: 'Aniversário do Estado do Acre' },
      { date: '09-05', name: 'Dia da Amazônia' },
      { date: '11-17', name: 'Tratado de Petrópolis' },
    ],
  },
  {
    uf: 'SE',
    holidays: [{ date: '07-08', name: 'Emancipação política de Sergipe' }],
  },
  {
    uf: 'TO',
    holidays: [
      { date: '01-01', name: 'Instalação de Tocantins' },
      { date: '09-08', name: 'Nossa Senhora da Natividade' },
      { date: '10-05', name: 'Criação de Tocantins' },
    ],
  },
  {
    uf: 'RO',
    holidays: [
      { date: '01-04', name: 'Criação do Estado de Rondônia' },
      { date: '06-18', name: 'Dia do Evangélico' },
    ],
  },
  {
    uf: 'AL',
    holidays: [
      { date: '06-24', name: 'Dia de São João' },
      { date: '06-29', name: 'Dia de São Pedro' },
      { date: '09-16', name: 'Emancipação Política de Alagoas' },
      ,
    ],
  },
  {
    uf: 'RR',
    holidays: [
      {
        date: '10-05',
        name:
          'Elevação do antigo Território Federal do Rio Branco a estado de Roraima',
      },
    ],
  },
  {
    uf: 'AP',
    holidays: [
      { date: '03-19', name: 'Dia de São José' },
      { date: '07-25', name: 'Dia de São Tiago' },
      { date: '11-20', name: 'Dia da Consciência Negra' },
    ],
  },
  {
    uf: 'PR',
    holidays: [],
  },
  {
    uf: 'PB',
    holidays: [{ date: '08-05', name: 'Fundação do Estado da Paraíba' }],
  },
  {
    uf: 'PI',
    holidays: [
      { date: '03-13', name: 'Dia da Batalha do Jenipapo' },
      { date: '10-19', name: 'Dia do Piauí' },
    ],
  },
  {
    uf: 'SP',
    holidays: [
      { date: '07-09', name: 'Revolução Constitucionalista de 1932' },
      { date: '11-20', name: 'Dia da Consciência Negra' },
    ],
  },
  {
    uf: 'MG',
    holidays: [{ date: '04-21', name: 'Data Magna de Minas Gerais' }],
  },
  {
    uf: 'RS',
    holidays: [
      { date: '09-20', name: 'Revolução Farroupilha (Dia do Gaúcho)' },
    ],
  },
  {
    uf: 'BA',
    holidays: [{ date: '07-02', name: 'Independência do Estado da Bahia' }],
  },
  {
    uf: 'PE',
    holidays: [
      { date: '03-06', name: 'Data Magna do Estado de Pernambuco' },
      { date: '06-24', name: 'Dia de São João' },
    ],
  },
  {
    uf: 'PA',
    holidays: [
      {
        date: '08-15',
        name: 'Adesão do Grão-Pará à independência do Brasil',
      },
    ],
  },
];

function getSantaCatarinaHolidays(year) {
  const santaCatarinaIndependenceDay = new Date(year, 7, 11);
  let santaCatarinaHolidayDate =
    santaCatarinaIndependenceDay.getDay() === 0
      ? 11
      : 7 - santaCatarinaIndependenceDay.getDay() + 11;

  return {
    uf: 'SC',
    holidays: [
      {
        date: `08-${santaCatarinaHolidayDate}`,
        name: 'Dia do Estado de Santa Catarina',
      },
    ],
  };
}

function getRioDeJaneiroHolidays(year) {
  const rioDeJaneiroFirstDay = new Date(year, 9, 1);
  let daysUntilMonday = rioDeJaneiroFirstDay.getDay() - 1;

  if (daysUntilMonday > 0) {
    daysUntilMonday -= 7;
  }

  const commerceDayInOctober = 14 + 1 - daysUntilMonday;

  return {
    uf: 'RJ',
    holidays: [
      {
        date: `10-${commerceDayInOctober}`,
        name: 'Dia do Comércio',
      },
      { date: '04-23', name: 'Dia de São Jorge' },
      { date: '11-20', name: 'Dia da Consciência Negra' },
    ],
  };
}

function variableStatewideHolidays(year) {
  const santaCatarinaHolidays = getSantaCatarinaHolidays(year);
  const rioDeJaneiroHolidays = getRioDeJaneiroHolidays(year);

  const result = [santaCatarinaHolidays, rioDeJaneiroHolidays];

  return result;
}

export default function getStatewideHolidays(year) {
  return [...fixedStatewideHolidays, ...variableStatewideHolidays(year)];
}
