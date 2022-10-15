import app from '@/app';
import { getUfs } from '@/services/ibge/gov';

const action = async (_, response) => {
  const { data, status } = await getUfs();

  response.status(status);
  return response.json(data);
};

export default app().get(action);
