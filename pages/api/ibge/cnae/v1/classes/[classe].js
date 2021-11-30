import app from '@/app';
import { getCNAEClassById } from '@/services/ibge/cnae';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { classe } = request.query;
  const { data, status } = await getCNAEClassById(classe);

  if (Array.isArray(data) && !data.length) {
    response.status(404);

    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Classe CNAE não encontrada.',
      type: 'not_found',
    });
  }

  response.status(status);
  return response.json(data);
};

export default app().get(action);
