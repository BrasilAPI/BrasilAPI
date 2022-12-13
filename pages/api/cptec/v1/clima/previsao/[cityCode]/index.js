import { getPredictionWeather } from '@/services/cptec';
import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import InternalError from '@/errors/InternalError';
import BaseError from '@/errors/BaseError';

const action = async (request, response) => {
  const { cityCode } = request.query;

  try {
    const weatherPredictions = await getPredictionWeather(cityCode, 1);

    if (!weatherPredictions) {
      throw new NotFoundError({
        message: 'Cidade não localizada',
        type: 'city_error',
        name: 'CITY_NOT_FOUND',
      });
    }

    if (weatherPredictions.clima.length === 0) {
      throw new NotFoundError({
        message: 'Previsões meteorológicas não localizadas',
        type: 'weather_error',
        name: 'WEATHER_PREDICTIONS_NOT_FOUND',
      });
    }

    response.json(weatherPredictions);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar previsões para a cidade',
      type: 'weather_error',
      name: 'CITY_WEATHER_PREDICTIONS_INTERNAL',
    });
  }
};

export default app().get(action);
