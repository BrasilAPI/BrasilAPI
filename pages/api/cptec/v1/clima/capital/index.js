import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getCurrentCapitalWeatherData } from '@/services/cptec';

async function getCapitalWeather(request, response) {
  try {
    const allCurrentConditionData = await getCurrentCapitalWeatherData();

    return response.status(200).json(allCurrentConditionData);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre capitais',
      type: 'city_error',
      name: 'CAPITAL_INTERNAL',
    });
  }
}

export default app().get(getCapitalWeather);
