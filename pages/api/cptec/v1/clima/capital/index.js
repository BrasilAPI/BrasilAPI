import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';

import { getCurrentCapitalWeatherData } from '@/services/cptec';

const action = async (request, response) => {
  try {
    const allCurrentConditionData = await getCurrentCapitalWeatherData();

    response.status(200);
    response.json(allCurrentConditionData);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre capitais',
      type: 'city_error',
      name: 'CAPITAL_INTERNAL',
    });
  }
};

export default app().get(action);
