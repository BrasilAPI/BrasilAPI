import microCors from 'micro-cors';

import { getSwellData } from '../../../../../../services/cptec';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const cityCode = request.query.cityCode;
  const days = request.query.days;

  if (days < 1 || days > 6) {
    response.status(400);
    response.json({
      message: 'Quantidade de dias inválida (mínimo 1 dia e máximo 6 dias)',
      type: 'INVALID_NUMBER_OF_DAYS',
    });

    return;
  }
  const swellPredictions = await getSwellData(cityCode, days);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if (!swellPredictions) {
    response.status(404);
    response.json({
      message: 'Cidade não localizada',
      type: 'CITY_NOT_FOUND',
    });

    return;
  }

  if (swellPredictions.swell.length === 0) {
    response.status(404);
    response.json({
      message: 'Previsões de ondas não disponíveis',
      type: 'SWELL_PREDICTIONS_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(swellPredictions);
};

export default cors(action);
