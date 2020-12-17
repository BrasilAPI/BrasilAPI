import microCors from 'micro-cors';

import { getPredictionWeather } from '../../../../../../../services/cptec/weather';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const cityCode = request.query.cityCode;
  const days = request.query.days;

  if (days < 1 || days > 14) {
    response.status(400);
    response.json({
      message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 14 dias)',
      type: 'INVALID_NUMBER_OF_DAYS',
    });

    return;
  }
  const weatherPredictions = await getPredictionWeather(cityCode, days);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if (!weatherPredictions) {
    response.status(404);
    response.json({
      message: 'Cidade não localizada',
      type: 'CITY_NOT_FOUND',
    });

    return;
  }

  if (weatherPredictions.weather.length === 0) {
    response.status(404);
    response.json({
      message: 'Previsões meteorológicas não localizadas',
      type: 'WEATHER_PREDICTIONS_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(weatherPredictions);
};

export default cors(action);
