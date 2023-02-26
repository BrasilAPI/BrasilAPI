import app from '@/app';
import { getIgpm } from '@/services/indices/igpm';
import { codes } from '../../codes';

const action = async (request, response) => {
  const igpmList = await getIgpm(codes.igpm);

  response.status(200);
  response.json(igpmList);
};

export default app().get(action);
