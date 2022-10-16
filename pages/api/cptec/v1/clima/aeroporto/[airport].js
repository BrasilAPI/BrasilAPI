import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { getCurrentAirportWeather } from '@/services/cptec';

const action = async (request, response) => {
  const icaoCode = request.query.airport;

  if (icaoCode.length !== 4) {
    throw new BadRequestError({
      message: 'Código ICAO inválido, os códigos ICAO devem ter 4 caracteres',
      type: 'request_error',
      name: 'INVALID_ICAO_CODE',
    });
  }
  try {
    const airportWeather = await getCurrentAirportWeather(icaoCode);

    if (!airportWeather) {
      throw new NotFoundError({
        message: 'Condições meteorológicas ou aeroporto não localizados',
        type: 'weather_error',
        name: 'AIRPORT_CONDITIONS_NOT_FOUND',
      });
    }

    response.status(200);
    response.json(airportWeather);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message:
        'Erro ao buscar informações meteorológicas para o aeroporto informado',
      type: 'weather_error',
      name: 'AIRPORT_WEATHER_PREDICTIONS_INTERNAL',
    });
  }
};

export default app().get(action);
