import app from '@/app';
import BadRequestError from '@/errors/bad-request';
import NotFoundError from '@/errors/not-found';
import { getPredictionWeather } from '@/services/cptec';

const action = async (request, response) => {
  const { days, cityCode } = request.query;

  if (days < 1 || days > 14) {
    throw new BadRequestError({
      message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 14 dias)',
      type: 'request_error',
      name: 'INVALID_NUMBER_OF_DAYS',
    });
  }
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
};

export default app({ cache: 172800 }).get(action);
