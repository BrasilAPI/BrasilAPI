import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getAllCitiesData } from '@/services/cptec';

async function getAllCities(request, response) {
  try {
    const allCitiesData = await getAllCitiesData();

    response.status(200);
    response.json(allCitiesData);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre cidades',
      type: 'city_error',
      name: 'CITY_INTERNAL',
    });
  }
}

export default app().get(getAllCities);
