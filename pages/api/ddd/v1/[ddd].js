import cities from 'cidades-promise';

import handle from 'handler';

async function CitiesByDdd(request) {
  const requestedCities = request.query.ddd;

  try {
    const citiesResult = await cities.getCitiesByDdd(requestedCities);

    return { status: 200, body: citiesResult };
  } catch (error) {
    throw error;
  }
}

export default handle(CitiesByDdd);
