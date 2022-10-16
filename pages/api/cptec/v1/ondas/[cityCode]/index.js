import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';

import { getSwellData } from '@/services/cptec';

const action = async (request, response) => {
  const { cityCode } = request.query;

  const weatherPredictions = await getSwellData(cityCode, 1);
  if (!weatherPredictions) {
    throw new NotFoundError({
      message: 'Cidade não localizada',
      type: 'city_error',
      name: 'CITY_NOT_FOUND',
    });
  }

  if (weatherPredictions.swell.length === 0) {
    throw new NotFoundError({
      message: 'Previsões de ondas não disponíveis',
      type: 'weather_error',
      name: 'SWELL_PREDICTIONS_NOT_FOUND',
    });
  }

  response.status(200);
  response.json(weatherPredictions);
};

export default app().get(action);
