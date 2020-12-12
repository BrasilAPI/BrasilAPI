import axios from 'axios';
import { CPTEC_URL, CITY_TEMPLATE } from './constants';
import { transform } from 'camaro';

export const getAllCitiesData = async () => {
    const citiesData = await axios.get(CPTEC_URL + 'listaCidades', {
        responseType: 'application/xml',
        responseEncoding: 'binary'
    });

    const jsonData = await transform(citiesData.data, CITY_TEMPLATE);

    return jsonData;
}

export const getCityData = async (name) => {
    const citiesData = await axios.get(CPTEC_URL + 'listaCidades?city=' + name, {
        responseType: 'application/xml',
        responseEncoding: 'binary'
    });

    const jsonData = await transform(citiesData.data, CITY_TEMPLATE);

    return jsonData;
}