import app from '@/app';
import NotFoundError from '@/errors/not-found';
import { findByCode } from '@/services/oms/cid10';

const action = async (request, response) => {
  const { code } = request.query;
  const data = findByCode(code);

  if (!data) {
    response.status(404);
    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'CID10 não encontrado',
      type: 'not_found',
    });
  }
  return response.status(200).json(data);
};

export default app().get(action);
