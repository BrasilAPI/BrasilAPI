import app from '@/app';
import { listStockTickers } from '@/services/tickers/listTickers';

async function action(request, response) {
  const tickers = await listStockTickers();
  response.status(200);
  response.json(tickers);
}

export default app().get(action);
