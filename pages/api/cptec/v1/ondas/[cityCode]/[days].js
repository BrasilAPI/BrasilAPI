import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import { getSwellData } from '@/services/cptec';

const action = async (request, response) => {
  const { days, cityCode } = request.query;

  if (days < 1 || days > 6) {
    response.status(400);
    response.json({
      message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
      type: 'request_error',
      name: 'INVALID_NUMBER_OF_DAYS',
    });

    return;
  }
  const swellPredictions = await getSwellData(cityCode, days);

  if (!swellPredictions) {
    throw new NotFoundError({
      message: 'Cidade não localizada',
      type: 'city_error',
      name: 'CITY_NOT_FOUND',
    });
  }

  if (swellPredictions.swell.length === 0) {
    throw new NotFoundError({
      message: 'Previsões de ondas não disponíveis',
      type: 'weather_error',
      name: 'SWELL_PREDICTIONS_NOT_FOUND',
    });
  }

  response.status(200);
  response.json(swellPredictions);
};

export default app().get(action);
