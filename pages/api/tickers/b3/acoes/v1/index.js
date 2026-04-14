import app from '@/app';
import { listStockTickers } from '@/services/tickers/listTickers';

async function action(request, response) {
  const tickers = await listStockTickers();
  return response.status(200).json(tickers);
}

export default app().get(action);
