import app from '@/app';
import { getExchangesData } from '../../../../../services/cvm/corretoras';

const action = async (request, response) => {
  const allExchangesData = await getExchangesData();

  response.status(200);
  response.json(allExchangesData);
};

export default app({ cache: 86400 }).get(action);
