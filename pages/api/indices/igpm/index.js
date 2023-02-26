import app from '@/app';
import { getIgpm } from '@/services/indices/igpm';

const action = async (request, response) => {
  const igpmList = await getIgpm();

  response.status(200);
  response.json(igpmList);
};

export default app().get(action);
