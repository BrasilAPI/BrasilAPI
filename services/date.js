const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const SUNDAY = 0;
const SATURDAY = 6;
const WEEKEND = [SUNDAY, SATURDAY];

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Sao_Paulo');

export const getNow = () => dayjs();

export const formatDate = (date, format = 'DD/MM/YYYY') =>
  dayjs(date).format(format);

export const parseToDate = (value, format = '') => {
  return dayjs(value, format).toDate();
};

export const isValidDate = (date) => dayjs(date).isValid();

export const isWeekend = (date) => {
  return WEEKEND.includes(dayjs(date).get('day'));
};

export const subBusinessDays = (date, days) => {
  const newDate = dayjs(date);
  let count = 0;

  if (isWeekend(date)) {
    if (newDate.get('day') === SATURDAY) {
      count = 1;
    } else {
      count = 2;
    }
  }

  return newDate.subtract(count + days, 'day').toDate();
};

/**
 * Valida se uma string de data no formato YYYY-MM-DD tem componentes válidos
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {object} { isValid: boolean, error?: string, errorType?: string, errorName?: string }
 */
export const validateDateComponents = (dateString) => {
  // Regex para extrair ano, mês e dia de uma data no formato YYYY-MM-DD
  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateString.match(dateRegex);

  if (!match) {
    return {
      isValid: false,
      error: 'Formato de data inválida, utilize: YYYY-MM-DD',
      errorType: 'format_error',
      errorName: 'DATE_FORMAT_INCORRECT_PATTERN',
    };
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  // Validar mês (01-12)
  if (month < 1 || month > 12) {
    return {
      isValid: false,
      error: 'Mês inválido: deve estar entre 01 e 12',
      errorType: 'format_error',
      errorName: 'INVALID_MONTH_VALUE',
    };
  }

  // Validar dia (01-31 considerando o mês específico)
  const daysInMonth = dayjs(
    `${year}-${month.toString().padStart(2, '0')}-01`
  ).daysInMonth();

  if (day < 1 || day > daysInMonth) {
    return {
      isValid: false,
      error: `Dia inválido: deve estar entre 01 e ${daysInMonth} para o mês ${month
        .toString()
        .padStart(2, '0')}`,
      errorType: 'format_error',
      errorName: 'INVALID_DAY_VALUE',
    };
  }

  // Validar que a data final corresponde aos componentes fornecidos
  // Isso garante que dayjs não fez ajustes silenciosos
  const parsedDate = dayjs(dateString, 'YYYY-MM-DD', true); // strict mode

  if (!parsedDate.isValid()) {
    return {
      isValid: false,
      error: 'Data inválida',
      errorType: 'format_error',
      errorName: 'INVALID_DATE',
    };
  }

  // Verificar se os componentes da data parseada correspondem aos fornecidos
  if (
    parsedDate.year() !== year ||
    parsedDate.month() + 1 !== month ||
    parsedDate.date() !== day
  ) {
    return {
      isValid: false,
      error:
        'Data inválida: os valores fornecidos não correspondem a uma data real',
      errorType: 'format_error',
      errorName: 'INVALID_DATE_COMPONENTS',
    };
  }

  return { isValid: true };
};
