import axios from 'axios';

/**
 * Get all Brazilian holidays by city
 * @returns {Array}
 */
export async function getHolidaysByCity(state, city, year) {
  const url = `https://raw.githubusercontent.com/joaopbini/feriados-brasil/master/dados/feriados/municipal/json/${year}.json`;
  const result = await axios({
    url,
    method: 'get',
    responseEncoding: 'utf-8',
  });

  const stateData = [];
  result.data.forEach((element) => {
    if (
      element.uf.toLowerCase().trim() === state.trim().toLowerCase() &&
      element.municipio.toLowerCase().trim().replace(/\s+/g, '') ===
        city.trim().toLowerCase()
    ) {
      stateData.push(element);
    }
  });
  return stateData;
}

/**
 * Get all Brazilian holidays by state
 * @returns {Array}
 */
export async function getHolidaysByState(state, year) {
  const url = `https://raw.githubusercontent.com/joaopbini/feriados-brasil/master/dados/feriados/estadual/json/${year}.json`;
  const result = await axios({
    url,
    method: 'get',
    responseEncoding: 'utf-8',
  });

  const stateData = [];
  result.data.forEach((element) => {
    if (element.uf.toLowerCase().trim() === state.trim().toLowerCase()) {
      stateData.push(element);
    }
  });

  return stateData;
}

/**
 * Get all Brazilian national holidays
 * @returns {Array}
 */
export async function getNationalHolidays(year) {
  const url = `https://raw.githubusercontent.com/joaopbini/feriados-brasil/master/dados/feriados/nacional/json/${year}.json`;
  const result = await axios({
    url,
    method: 'get',
    responseEncoding: 'utf-8',
  });

  return result.data;
}
