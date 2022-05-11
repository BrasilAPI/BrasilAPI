import app from '@/app';
import { getUfByCode } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { code } = request.query;
  const { data, status } = await getUfByCode(code);

  if (Array.isArray(data) && !data.length) {
    response.status(404);

    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'UF não encontrado.',
      type: 'not_found',
    });
  }

  response.status(status);
  return response.json(data);
};

export default app().get(action);
