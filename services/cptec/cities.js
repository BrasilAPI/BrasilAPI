import axios from 'axios';
import { transform } from 'camaro';
import { CPTEC_URL, CITY_TEMPLATE } from './constants';

/**
 * Get all Brazilian cities on CPTEC database
 * @returns {Array}
 */
export const getAllCitiesData = async () => {
  const citiesData = await axios.get(`${CPTEC_URL}/listaCidades`, {
    responseType: 'application/xml',
    responseEncoding: 'binary',
  });

  return transform(citiesData.data, CITY_TEMPLATE);
};

/**
 * Search Brazilian cities by name
 * @param {string} name
 * @returns {Array}
 */
export const getCityData = async (name) => {
  const citiesData = await axios.get(`${CPTEC_URL}/listaCidades?city=${name}`, {
    responseType: 'application/xml',
    responseEncoding: 'binary',
  });

  return transform(citiesData.data, CITY_TEMPLATE);
};
