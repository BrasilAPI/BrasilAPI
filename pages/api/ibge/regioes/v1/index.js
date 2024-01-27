import app from '@/app';
import { getRegions } from '@/services/ibge/gov';

const action = async (_, response) => {
  const { data, status } = await getRegions();

  response.status(status);
  return response.json(data);
};

export default app().get(action);
