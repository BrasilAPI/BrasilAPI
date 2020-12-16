import microCors from 'micro-cors';
import removeSpecialChars from '../../../../../services/util/removeSpecialChars';
import { getCityData } from '../../../../../services/cptec/cities';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const cityName = removeSpecialChars(request.query.name);
  
  const cityData = await getCityData(cityName);
  
  if (!cityData) {
    response.status(404);
    response.json({
      message: 'Cidade não localizada',
      type: 'CITY_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(cityData);

  return response;
}

export default cors(action);
