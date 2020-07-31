import cities from 'cidades-promise';
import microCors from 'micro-cors';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate';
const cors = microCors();

// retorna estado e lista de cidades por DDD
// exemplo da rota: /api/cities/v1/ddd/21

async function CitiesByDdd(request, response) {
  const requestedCities = request.query.ddd;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const citiesResult = await cities.getCitiesByDdd(requestedCities);

    response.status(200);
    response.json(citiesResult);
  } catch (error) {
    if (error.name === 'citiesPromiseError') {
      response.status(404);
      response.json(error);
      return;
    }

    response.status(500);
    response.json(error);
  }
}

export default cors(CitiesByDdd);
