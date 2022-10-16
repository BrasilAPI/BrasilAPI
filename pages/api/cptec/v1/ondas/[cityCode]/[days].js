import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';
import { getSwellData } from '@/services/cptec';

const action = async (request, response) => {
  const { days, cityCode } = request.query;

  if (Number.isNaN(Number(days))) {
    throw new BadRequestError({
      message: 'Quantidade de dias inválida, informe um valor numérico',
      type: 'request_error',
      name: 'INVALID_NUMBER_OF_DAYS',
    });
  }

  if (days < 1 || days > 6) {
    throw new BadRequestError({
      message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
      type: 'request_error',
      name: 'INVALID_NUMBER_OF_DAYS',
    });
  }

  try {
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
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre ondas',
      type: 'weather_error',
      name: 'SWELL_PREDICTIONS_NOT_FOUND',
    });
  }
};

export default app().get(action);
