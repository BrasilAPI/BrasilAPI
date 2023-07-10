import app from '@/app';
import { getAeroportosData } from '@/services/aeroportos';

const action = async (request, response) => {
  const allAeroportosData = await getAeroportosData();

  response.status(200);
  response.json(allAeroportosData);
};

export default app().get(action);
