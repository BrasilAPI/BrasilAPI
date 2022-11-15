import app from '@/app';

import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { getDddsData } from '@/services/ddd';

function getNumbersDDD(dddData) {
  return dddData.reduce((group, ddd) => {
    if (!group.some((dddGroup) => dddGroup === ddd.ddd)) {
      group.push(ddd.ddd);
    }
    return group;
  }, []);
}

async function dddsOfState(request, response, next) {
  try {
    const requestedUf = request.query.uf;

    const allDddData = await getDddsData();

    const dddsData = allDddData.filter(
      ({ state }) =>
        String(state).toLowerCase() === String(requestedUf).toLowerCase()
    );

    if (dddsData.length === 0) {
      throw new NotFoundError({
        message: 'DDDs não encontrados',
        type: 'ddd_error',
        name: 'DDD_NOT_FOUND',
      });
    }

    const listDDD = getNumbersDDD(dddsData);

    const dddResponse = [];
    listDDD.forEach((dddNumber) => {
      dddsData
        .filter((dddFilter) => dddFilter.ddd === dddNumber)
        .forEach((dddData) => {
          if (!dddResponse.some((dddSome) => dddSome.ddd === dddNumber))
            dddResponse.push({
              ddd: dddNumber,
              state: dddData.state,
              cities: [dddData.city],
            });
          else
            dddResponse
              .filter((dddFilter) => dddFilter.ddd === dddNumber)[0]
              .cities.push(dddData.city);
        });
    });

    response.status(200);
    return response.json(dddResponse);
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

export default app().get(dddsOfState);
