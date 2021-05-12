export default function normalizeBrazilianDate(date) {
  const dateObj = new Date();
  const fullDateParts = date.split(' '); // Split hours from date
  const dateParts = fullDateParts[0].split('/');
  const hourParts = fullDateParts[1].split(':');
  dateObj.setFullYear(dateParts[2]);
  dateObj.setMonth(dateParts[1]);
  dateObj.setDate(dateParts[0]);
  dateObj.setHours(hourParts[0]);
  dateObj.setMinutes(hourParts[1]);
  dateObj.setSeconds(hourParts[2]);

  return dateObj;
}
