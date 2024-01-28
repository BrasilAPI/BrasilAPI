import app from '@/app';
import { getRegionByCode } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { regionCode } = request.query;
  const { data, status } = await getRegionByCode(regionCode);

  if (Array.isArray(data) && !data.length) {
    throw new NotFoundError({ message: 'Região não encontrada.' });
  }

  response.status(status);
  return response.json(data);
};

export default app().get(action);
