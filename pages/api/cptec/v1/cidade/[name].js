import app from '@/app';
import BaseError from '@/errors/BaseError';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';
import { getCityData } from '@/services/cptec';
import removeSpecialChars from '@/util/removeSpecialChars';

async function getCityByName(request, response) {
  try {
    const cityName = removeSpecialChars(request.query.name);

    if (cityName.length === 0) {
      throw new BadRequestError({
        message: 'Nome da cidade inválido',
        type: 'city_error',
        name: 'CITY_NAME_ERROR',
      });
    }

    const cityData = await getCityData(cityName);

    if (!cityData || cityData.length === 0) {
      throw new NotFoundError({
        message: 'Nenhuma cidade localizada',
        type: 'city_error',
        name: 'NO_CITY_NOT_FOUND',
      });
    }

    return response.status(200).json(cityData);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar informações sobre cidade',
      type: 'city_error',
      name: 'CITY_INTERNAL',
    });
  }
}

export default app().get(getCityByName);
