import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getIgpmByLastNRecords } from '@/services/indices/igpm';

const action = async (request, response) => {
  const { limit } = request.query;

  if (!limit) {
    throw new BadRequestError({
      message: 'Limite inválido, informe um número maior ou igual a 1',
    });
  }

  if (limit <= 0) {
    throw new BadRequestError({
      message: 'Limite inválido, informe um número maior ou igual a 1',
    });
  }

  const igpmList = await getIgpmByLastNRecords(limit);

  response.status(200);
  return response.json(igpmList);
};

export default app().get(action);
