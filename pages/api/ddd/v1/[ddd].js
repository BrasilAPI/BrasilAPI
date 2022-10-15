import app from '@/app';

import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { getDddsData } from '@/services/ddd';

async function citiesOfDdd(request, response, next) {
  try {
    const requestedDdd = request.query.ddd;

    const allDddData = await getDddsData();

    const dddData = allDddData.filter(({ ddd }) => ddd === requestedDdd);

    if (dddData.length === 0) {
      throw new NotFoundError({
        message: 'DDD não encontrado',
        type: 'ddd_error',
        name: 'DDD_NOT_FOUND',
      });
    }

    const { state } = dddData[0];

    const cities = dddData.map((ddd) => ddd.city);

    const dddResult = {
      state,
      cities,
    };

    response.status(200);
    return response.json(dddResult);
  } catch (error) {
    if (error instanceof BaseError) {
      return next(error);
    }

    throw new InternalError({
      message: 'Todos os serviços de DDD retornaram erro.',
      type: 'service_error',
    });
  }
}

export default app().get(citiesOfDdd);
