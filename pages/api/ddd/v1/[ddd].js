import cities from 'cidades-promise';

import { handle } from '../../../../handler';
import { get } from '../../../../handler/middlewares';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate';

// retorna estado e lista de cidades por DDD
// exemplo da rota: /api/cities/v1/ddd/21

async function CitiesByDdd(request, response, next) {
  const requestedCities = request.query.ddd;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const citiesResult = await cities.getCitiesByDdd(requestedCities);

    response.status(200);
    response.json(citiesResult);
  } catch (error) {
    if (error.name === 'citiesPromiseError') {
      response.status(404);
      next(error);
    }

    response.status(500);
    next(error);
  }
}

export default handle(get(CitiesByDdd));
