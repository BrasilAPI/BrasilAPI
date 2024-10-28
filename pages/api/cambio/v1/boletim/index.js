import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getBulletins } from '@/services/cambio';

const action = async (request, response) => {
  try {
    const bulletins = await getBulletins(request.query);

    response.status(200).json(bulletins);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao buscar boletim.',
      type: 'bulletins_error',
    });
  }
};

export default app().get(action);
