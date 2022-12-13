import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { getSwellData } from '@/services/cptec';

const action = async (request, response) => {
  const { cityCode } = request.query;

  try {
    const weatherPredictions = await getSwellData(cityCode, 1);
    if (!weatherPredictions) {
      throw new NotFoundError({
        message: 'Cidade não localizada',
        type: 'city_error',
        name: 'CITY_NOT_FOUND',
      });
    }

    if (weatherPredictions.ondas.length === 0) {
      throw new NotFoundError({
        message: 'Previsões de ondas não disponíveis',
        type: 'weather_error',
        name: 'SWELL_PREDICTIONS_NOT_FOUND',
      });
    }

    response.status(200);
    response.json(weatherPredictions);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre ondas',
      type: 'weather_error',
      name: 'SWELL_PREDICTIONS_ERROR',
    });
  }
};

export default app().get(action);
