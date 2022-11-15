import app from '@/app';

import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { getDddsData } from '@/services/ddd';

async function allDDD(request, response, next) {
  try {
    const allDddData = await getDddsData();

    const dddsData = allDddData.filter(({ ddd }) => ddd !== undefined);

    if (dddsData.length === 0) {
      throw new NotFoundError({
        message: 'DDDs não encontrados',
        type: 'ddd_error',
        name: 'DDD_NOT_FOUND',
      });
    }

    const dddResponse = [];
    dddsData.forEach((dddData) => {
      if (!dddResponse.some(({ state }) => state === dddData.state))
        dddResponse.push({ state: dddData.state, ddds: [dddData.ddd] });
      else {
        const { ddds } = dddResponse.filter(
          (d) => d.state === dddData.state
        )[0];
        if (!ddds.some((dddSome) => dddSome === dddData.ddd))
          ddds.push(dddData.ddd);
      }
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

export default app().get(allDDD);
