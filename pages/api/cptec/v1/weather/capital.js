import microCors from 'micro-cors';

import { getCurrentCapitalWeatherData } from '../../../../../services/cptec/weather';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
    const allCurrentConditionData = await getCurrentCapitalWeatherData();

    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
  
    response.status(200);
    response.json(allCurrentConditionData);
};

export default cors(action);
