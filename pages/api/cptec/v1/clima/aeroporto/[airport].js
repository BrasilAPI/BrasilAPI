import app from '@/app';
import NotFoundError from '@/errors/not-found';

import { getCurrentAirportWeather } from '@/services/cptec';

const action = async (request, response) => {
  const icaoCode = request.query.airport;
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
};

export default app({ cache: 172800 }).get(action);
