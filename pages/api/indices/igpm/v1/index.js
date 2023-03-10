import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getIgpm } from '@/services/indices/igpm';
import { bcbSgsCodes } from '../../codes';

const action = async (request, response) => {
  try {
    const igpmList = await getIgpm(bcbSgsCodes.igpm);

    response.status(200);
    response.json(igpmList);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      status: 500,
      type: 'INTERNAL',
    });
  }
};

export default app().get(action);
