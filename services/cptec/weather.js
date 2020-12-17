import axios from 'axios';
import { CPTEC_URL, CAPITAL_TEMPLATE, AIRPORT_TEMPLATE, PREDICTION_TEMPLATE, CONDITION_DESCRIPTIONS } from './constants';
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

/**
 * Get weather predicion for the next {days} with a limit of 14 days
 * @param {int} cityCode 
 * @param {int} days 
 * @returns {object}
 */
export const getPredictionWeather = async (cityCode, days) => {
    const baseUrl = CPTEC_URL + 'cidade/';
    let url = baseUrl;
    if(days <=4 ) {
        url += cityCode + '/previsao.xml';
    } else {
        url += '7dias/' + cityCode + '/previsao.xml';
    } 

    const weatherPredictions = await axios.get(url, {
        responseType: 'application/xml',
        responseEncoding: 'binary'
    });

    const jsonData = await transform(weatherPredictions.data, PREDICTION_TEMPLATE);
    if(jsonData.city_name === 'null') {
        return null;
    }

    // If number of days requested was greater than 7, load extended data from service
    if(days > 7) {
        const extendedPredictions = await axios.get(baseUrl +  cityCode + '/estendida.xml', {
            responseType: 'application/xml',
            responseEncoding: 'binary'
        });

        
        const extendedJsonData = await transform(extendedPredictions.data, PREDICTION_TEMPLATE);

        jsonData.weather = [ ...jsonData.weather, ...extendedJsonData.weather];
    }

    // IF total data greater than requested number of days, slice array into correct size
    if(jsonData.weather.length > days) {
        jsonData.weather = jsonData.weather.slice(0, days);
    }

    jsonData.weather.map((pred) =>  {
        pred.condition_desc = CONDITION_DESCRIPTIONS[pred.condition];
    });

    return jsonData;
}