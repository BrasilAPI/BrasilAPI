import axios from 'axios';
import { CURRENCY_URLS } from './constants';

export async function getExchangeBetweenCurrencies(fromCurrency, toCurrency) {
  const response = await axios.get(
    `${CURRENCY_URLS.GET_EXCHANGE}${toCurrency}-${fromCurrency}`
  );

  const rawExchange = response.data[toCurrency + fromCurrency];

  return {
    priceToSell: Number(rawExchange.ask),
    priceToBuy: Number(rawExchange.bid),
    variation: Number(rawExchange.varBid),
    variationPercentage: Number(rawExchange.pctChange),
    maxPrice: Number(rawExchange.high),
    minPrice: Number(rawExchange.low),
    avgPrice: (Number(rawExchange.high) + Number(rawExchange.low)) / 2,
  };
}
