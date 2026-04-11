/**
 * Normalize bra\ilian date with(out) custom separator to datetime object
 * @param {string} date String date in brazilian format
 * @param {string} separator Separator
 * @param {boolean} hasHour Has or not hour part in string
 * @returns Date
 */
export default function normalizeBrazilianDate(
  date,
  separator = '/',
  hasHour = true
) {
  const dateObj = new Date();
  const fullDateParts = date.split(' '); // Split hours from date
  const dateParts = fullDateParts[0].split(separator);

  dateObj.setFullYear(dateParts[2]);
  dateObj.setMonth(dateParts[1] - 1);
  dateObj.setDate(dateParts[0]);
  if (hasHour) {
    const hourParts = fullDateParts[1].split(':');
    dateObj.setHours(hourParts[0]);
    dateObj.setMinutes(hourParts[1]);
    dateObj.setSeconds(hourParts[2]);
  }
  return dateObj;
}
