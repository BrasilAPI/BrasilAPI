import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';
import { getPredictionWeatherByLocation } from '@/services/cptec';

const action = async (request, response) => {
  const { lat, long } = request.query;

  if (!Number.isFinite(Number(lat))) {
    throw new BadRequestError({
      message: 'Latitude inválida, informe um valor numérico',
      type: 'request_error',
      name: 'INVALID_POSITION_LAT',
    });
  }

  if (!Number.isFinite(Number(long))) {
    throw new BadRequestError({
      message: 'Longitude inválida, informe um valor numérico',
      type: 'request_error',
      name: 'INVALID_POSITION_LONG',
    });
  }

  try {
    const weatherPredictions = await getPredictionWeatherByLocation(lat, long);

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

    throw new NotFoundError({
      message: 'Cidade não localizada',
      type: 'city_error',
      name: 'CITY_NOT_FOUND',
    });
  }
};

export default app().get(action);
