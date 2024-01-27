import app from '@/app';
import { getUfsByRegion } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { region } = request.query;
  const { data, status } = await getUfsByRegion(region);

  if (Array.isArray(data) && !data.length) {
    throw new NotFoundError({ message: 'Região não encontrada.' });
  }

  response.status(status);
  return response.json(data);
};

export default app().get(action);
