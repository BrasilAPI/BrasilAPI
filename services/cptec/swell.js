import axios from 'axios';
import { CPTEC_URL, SWELL_TEMPLATE } from './constants';
import normalizeBrazilianDate from '../util/normalizeBrazilianDate';
import { transform } from 'camaro';

export const getSwellData = async (cityCode, days) => {
    const url = CPTEC_URL + 'cidade/' + cityCode + '/todos/tempos/ondas.xml';

    try {
        const swellData = await axios.get(url, {
            responseType: 'application/xml',
            responseEncoding: 'binary'
        });

        const jsonData = await transform(swellData.data, SWELL_TEMPLATE);

        // group data by day
        let oldDate = '';
        let newItem;
        const newSwellArr = [];
        for(const item of jsonData.swell) {
            const datePart = item.date_time.split(' ');
            if(datePart[0] !== oldDate) {
                oldDate = datePart[0];
                newItem = {};
                newItem.date = datePart[0];
                newItem.swell_data = [];
                newSwellArr.push(newItem);
            }
            delete item.date_time;
            item.hour = datePart[1] + ' ' + datePart[2];
            newItem.swell_data.push(item);
        }

        jsonData.swell = newSwellArr;
        console.log(newSwellArr);
        
        

        // IF total data greater than requested number of days, slice array into correct size
        if(jsonData.swell.length > days) {
            jsonData.swell = jsonData.swell.slice(0, days);
        }
        

        return jsonData;
    } catch (error) { // If city code don't have info about waves, remove service throw an exception
        return null;
    }
};