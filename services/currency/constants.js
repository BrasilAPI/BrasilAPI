const CURRENCY_BASE_URL = 'https://economia.awesomeapi.com.br/json';

export const CURRENCY_URLS = Object.freeze({
  GET_ALL: `${CURRENCY_BASE_URL}/available/uniq`,
  GET_EXCHANGE: `${CURRENCY_BASE_URL}/last/`,
});
