import app from '@/app';
import { getCNAEClassesByGroup } from '@/services/ibge/cnae';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { grupo } = request.query;
  const { data, status } = await getCNAEClassesByGroup(grupo);

  if (Array.isArray(data) && !data.length) {
    response.status(404);

    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Grupo CNAE não encontrado.',
      type: 'not_found',
    });
  }

  response.status(status);
  return response.json(data);
};

export default app().get(action);
