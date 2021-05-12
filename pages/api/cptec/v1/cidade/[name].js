import removeSpecialChars from '@/services/util/removeSpecialChars';
import { getCityData } from '@/services/cptec';
import NotFoundError from '@/errors/not-found';
import app from '@/app';

const action = async (request, response) => {
  const cityName = removeSpecialChars(request.query.name);

  const cityData = await getCityData(cityName);

  if (!cityData || cityData.length === 0) {
    throw new NotFoundError({
      message: 'Nenhuma cidade localizada',
      type: 'city_error',
      name: 'NO_CITY_NOT_FOUND',
    });
  }

  response.json(cityData);

  return response;
};

export default app({ cache: 172800 }).get(action);
