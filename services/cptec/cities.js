import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { CPTEC_URL, STATE_REGION_MAP } from './constants';

const parser = new XMLParser();

const formatCity = (city) => {
  const estado = city.uf;
  const regiao = STATE_REGION_MAP[estado] ?? null;
  const { uf, ...rest } = city;

  return {
    ...rest,
    estado,
    regiao,
  };
};

/**
 * Get all Brazilian cities on CPTEC database
 * @returns {Array}
 */
export const getAllCitiesData = async () => {
  const citiesData = await axios.get(`${CPTEC_URL}/listaCidades`, {
    responseType: 'application/xml',
    responseEncoding: 'binary',
  });

  const parsed = parser.parse(citiesData.data);
  if (parsed.cidades.cidade) {
    return parsed.cidades.cidade.map(formatCity);
  }
  return [];
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

  const parsed = parser.parse(citiesData.data);

  if (parsed.cidades.cidade) {
    if (parsed.cidades.cidade instanceof Array) {
      return parsed.cidades.cidade.map(formatCity);
    } else if (parsed.cidades.cidade instanceof Object) {
      return [formatCity(parsed.cidades.cidade)];
    }
  }
  return [];
};
