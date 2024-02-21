import app from '@/app';
import { getAllCurrencies } from '@/services/currency';

async function getList(_request, response) {
  const currencies = await getAllCurrencies();
  return response.json(currencies);
}

export default app().get(getList);
