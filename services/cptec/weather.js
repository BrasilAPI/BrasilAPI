import axios from 'axios';
import { CPTEC_URL, CAPITAL_TEMPLATE, AIRPORT_TEMPLATE } from './constants';
import normalizeBrazilianDate from '../util/normalizeBrazilianDate';
import { transform } from 'camaro';

/**
 * Get current weather data for all Brazilian Capitals
 * @returns {Array}
 */
export const getCurrentCapitalWeatherData = async () => {
    const currentData = await axios.get(CPTEC_URL + 'capitais/condicoesAtuais.xml', {
        responseType: 'application/xml',
        responseEncoding: 'binary'
    });

    const jsonData = await transform(currentData.data, CAPITAL_TEMPLATE);
    jsonData.map((item) =>  {
        item.last_update = normalizeBrazilianDate(item.last_update);
        return item;
    });

    return jsonData;
}

/**
 * Get current weather data for a Brazilian Airport by ICAO code
 * @param {string} icaoCode 
 * @returns {object}
 */
export const getCurrentAirportWeather = async (icaoCode) => {
    const airportWeather = await axios.get(CPTEC_URL + 'estacao/' + icaoCode + '/condicoesAtuais.xml', {
        responseType: 'application/xml',
        responseEncoding: 'binary'
    });

    const jsonData = await transform(airportWeather.data, AIRPORT_TEMPLATE);

    return jsonData.length > 0 && jsonData[0].icao_code !== 'UNDEFINED' ? jsonData[0] : null;
}
