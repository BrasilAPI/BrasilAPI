import axios from 'axios';
import { CURRENCY_URLS } from './constants';

export async function getAllCurrencies() {
  const response = await axios.get(CURRENCY_URLS.GET_ALL);

  return Object.entries(response.data).map(([currencyCode, currencyName]) => ({
    code: currencyCode,
    name: currencyName,
  }));
}
