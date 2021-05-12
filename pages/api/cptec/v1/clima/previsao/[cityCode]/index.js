import { getPredictionWeather } from '@/services/cptec';
import app from '@/app';
import NotFoundError from '@/errors/not-found';

const action = async (request, response) => {
  const { cityCode } = request.query;

  const weatherPredictions = await getPredictionWeather(cityCode, 1);

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
