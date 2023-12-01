import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getUniversity } from '@/services/university/getUniversity';

const action = (request, response) => {
  try {
    const university = getUniversity();

    console.log(university[0]);
    console.log(university[1]);
    console.log(university[2]);
    response.status(200);
    return response.json(university);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao usar .',
      type: 'university_error',
    });
  }
};

export default app().get(action);
