import app from '@/app';
import { getUfByCode } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { code } = request.query;
  const { data, status } = await getUfByCode(code);

  if (Array.isArray(data) && !data.length) {
    throw new NotFoundError({ message: 'UF não encontrada.' });
  }

  response.status(status);
  return response.json(data);
};

export default app().get(action);
