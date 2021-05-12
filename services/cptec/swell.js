import axios from 'axios';
import { transform } from 'camaro';
import { CPTEC_URL, SWELL_TEMPLATE } from './constants';

export const getSwellData = async (cityCode, days) => {
  const url = `${CPTEC_URL}cidade/${cityCode}/todos/tempos/ondas.xml`;

  try {
    const swellData = await axios.get(url, {
      responseType: 'application/xml',
      responseEncoding: 'binary',
    });

    const jsonData = await transform(swellData.data, SWELL_TEMPLATE);

    // group data by day
    let oldDate = '';
    const newSwellArr = {
      city_name: jsonData.city_name,
      state: jsonData.state,
      swell: [],
    };
    let newItem = {};
    jsonData.swell.map((item) => {
      const datePart = item.date_time.split(' ');
      const [date, hour, tz] = datePart;
      if (date !== oldDate) {
        [oldDate] = datePart;
        newItem = {};
        newItem.date = oldDate;
        newItem.swell_data = [];
        newSwellArr.swell.push(newItem);
      }
      delete newItem.date_time;
      newItem.hour = `${hour} ${tz}`;
      newItem.swell_data = item;
      return newItem;
    });

    // IF total data greater than requested number of days, slice array into correct size
    if (newSwellArr.swell.length > days) {
      newSwellArr.swell = newSwellArr.swell.slice(0, days);
      return newSwellArr;
    }

    return newSwellArr;
  } catch (error) {
    // If city code don't have info about waves, remove service throw an exception
    return null;
  }
};
