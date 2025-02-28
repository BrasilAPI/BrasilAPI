import app from '@/app';
import { getCityData } from '@/services/cptec';

import removeSpecialChars from '@/util/removeSpecialChars';

import NotFoundError from '@/errors/NotFoundError';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import BadRequestError from '@/errors/BadRequestError';

const action = async (request, response) => {
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

    response.json(cityData);
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
};

export default app().get(action);
