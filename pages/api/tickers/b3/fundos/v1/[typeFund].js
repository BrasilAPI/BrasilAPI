import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { listInvestmentFundTickers } from '@/services/tickers/listTickers';

const TYPE_FUNDS = [
  'FII',
  'SETORIAL',
  'FIAGRO-FII',
  'FIAGRO-FIDC',
  'FIAGRO-FIP',
  'FIP',
  'FIA',
];

async function action(request, response) {
  const { typeFund } = request.query;
  if (!typeFund) {
    throw new BadRequestError({ message: 'Type fund is required' });
  }

  if (!TYPE_FUNDS.includes(typeFund)) {
    throw new BadRequestError({ message: 'Type fund is invalid' });
  }

  const tickers = await listInvestmentFundTickers({ typeFund });

  response.status(200);
  response.json(tickers);
}

export default app().get(action);
