import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';
import { getCurrentAirportWeatherV2 } from '@/services/cptec';

const action = async (request, response) => {
  const { airport } = request.query;

  if (typeof airport !== 'string' || !/^[a-z]{4}$/i.test(airport)) {
    throw new BadRequestError({
      message: 'Código ICAO inválido, informe 4 letras',
      type: 'request_error',
      name: 'INVALID_ICAO_CODE',
    });
  }

  try {
    const airportWeather = await getCurrentAirportWeatherV2(
      airport.toUpperCase()
    );

    if (!airportWeather) {
      throw new NotFoundError({
        message: 'Condições meteorológicas ou aeroporto não localizados',
        type: 'weather_error',
        name: 'AIRPORT_CONDITIONS_NOT_FOUND',
      });
    }

    return response.status(200).json(airportWeather);
  } catch (error) {
    if (error instanceof BaseError) throw error;

    throw new InternalError({
      message:
        'Erro ao buscar informações meteorológicas para o aeroporto informado',
      type: 'weather_error',
      name: 'AIRPORT_WEATHER_PREDICTIONS_INTERNAL',
    });
  }
};

export default app().get(action);
