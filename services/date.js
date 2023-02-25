const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Sao_Paulo');

export const getNow = () => dayjs();

export const formatDate = (date = dayjs(), format = 'DD/MM/YYYY') =>
  date.format(format);

export const parseToDate = (value, format = '') => {
  return dayjs(value, format).toDate();
};
