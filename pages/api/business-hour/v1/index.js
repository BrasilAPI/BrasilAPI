import app from '@/app';
import axios from 'axios';

import { format as formatTz, utcToZonedTime } from 'date-fns-tz';

const getHolidaysCalendar = async (country, year) => {
  const { data } = await axios({
    baseURL: 'https://raw.githubusercontent.com/',
    method: 'GET',
    endpoint: `pagarme/business-calendar/master/data/${country}/${year}.json`,
  })

  return data
}

const brazilianTimeZone = 'America/Bahia';

export const isBusinessHour = async (date) => {
  const brazilDate = utcToZonedTime(date, brazilianTimeZone);

  const hour = brazilDate.getHours();

  const notBusinessHour = hour < 9 || hour >= 18;

  if (notBusinessHour) {
    return false;
  }

  const isWeekend = brazilDate.getDay() === 0 || brazilDate.getDay() === 6;

  if (isWeekend) {
    return false;
  }

  const dateWithoutHours = formatTz(brazilDate, 'yyyy-MM-dd', {
    timeZone: brazilTimeZone,
  });

  const holidaysCalendar = prop(
    'calendar',
    await getHolidaysCalendar('brazil', brazilDate.getFullYear())
  );

  const isHoliday = holidaysCalendar.find(
    (holiday) => holiday.date === dateWithoutHours
  );

  if (isHoliday) {
    return false;
  }

  return true;
};

const action = async (_request, response) => {
  const date = new Date()
  const result = await isBusinessHour(date)

  response.status(200);
  return response.json({ result });
};

export default app().get(action);
