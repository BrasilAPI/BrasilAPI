const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.tz.setDefault('America/Sao_Paulo');

export const getNow = () => dayjs();

export const formatDate = (date = dayjs(), format = 'DD/MM/YYYY') =>
  date.format(format);

export const parseToDate = (value, format = '') => {
  return dayjs(value, format).toDate();
};

export const isValidDate = (value) => {
  return dayjs(value).isValid();
};

export const isBefore = (initialDate, dateToCompare) => {
  return dayjs(initialDate).isBefore(dateToCompare);
};

export const isAfter = (initialDate, dateToCompare) => {
  return dayjs(initialDate).isAfter(dateToCompare);
};

export const toISOString = (date, fromFormat = '') => {
  return dayjs(date, fromFormat).toISOString();
};
