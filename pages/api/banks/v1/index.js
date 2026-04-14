import app from '@/app';
import { getBanksData } from '@/services/banco-central';

const action = async (request, response) => {
  const allBanksData = await getBanksData();

  return response.status(200).json(allBanksData);
};

export default app().get(action);
