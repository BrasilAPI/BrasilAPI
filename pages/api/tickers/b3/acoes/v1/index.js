import app from '@/app';
import { listTickers } from '@/services/tickers/listTickers';

async function action(request, response) {
  const tickers = await listTickers();
  response.status(200);
  response.json(tickers);
}

export default app().get(action);
