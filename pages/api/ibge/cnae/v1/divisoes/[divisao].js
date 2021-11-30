import app from '@/app';
import { getCNAEClassesByDivision } from '@/services/ibge/cnae';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { divisao } = request.query;
  const { data, status } = await getCNAEClassesByDivision(divisao);

  if (Array.isArray(data) && !data.length) {
    response.status(404);

    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Divisão CNAE não encontrada.',
      type: 'not_found',
    });
  }

  response.status(status);
  return response.json(data);
};

export default app().get(action);
