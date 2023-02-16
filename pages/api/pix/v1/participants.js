import app from '@/app';
import InternalError from '@/errors/InternalError';
import { participants } from '@/services/pix/participants';

const action = async (request, response) => {
  try {
    const data = await participants();

    response.status(200);
    response.json(data);
  } catch (error) {
    throw new InternalError({
      status: 500,
      message: 'Erro ao obter as informações do BCB',
      name: 'PIX_LIST_ERROR',
    });
  }
};

export default app({ cache: 21600 }).get(action);
