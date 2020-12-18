import microCors from 'micro-cors';

import { getSwellData } from '../../../../../../services/cptec';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const cityCode = request.query.cityCode;

  const weatherPredictions = await getSwellData(cityCode, 1);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if (!weatherPredictions) {
    response.status(404);
    response.json({
      message: 'Cidade não localizada',
      type: 'CITY_NOT_FOUND',
    });

    return;
  }

  if (weatherPredictions.swell.length === 0) {
    response.status(404);
    response.json({
      message: 'Previsões de ondas não disponíveis',
      type: 'SWELL_PREDICTIONS_NOT_FOUND',
    });

    return;
  }


  response.status(200);
  response.json(weatherPredictions);
};

export default cors(action);
