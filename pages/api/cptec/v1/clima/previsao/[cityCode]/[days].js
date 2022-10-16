import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';
import { getPredictionWeather } from '@/services/cptec';

const action = async (request, response) => {
  const { days, cityCode } = request.query;

  if (Number.isNaN(Number(days))) {
    throw new BadRequestError({
      message: 'Quantidade de dias inválida, informe um valor numérico',
      type: 'request_error',
      name: 'INVALID_NUMBER_OF_DAYS',
    });
  }

  if (days < 1 || days > 14) {
    throw new BadRequestError({
      message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 14 dias)',
      type: 'request_error',
      name: 'INVALID_NUMBER_OF_DAYS',
    });
  }

  try {
    const weatherPredictions = await getPredictionWeather(cityCode, days);

    if (!weatherPredictions) {
      throw new NotFoundError({
        message: 'Cidade não localizada',
        type: 'city_error',
        name: 'CITY_NOT_FOUND',
      });
    }

    if (weatherPredictions.weather.length === 0) {
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
