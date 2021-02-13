import microCors from 'micro-cors';
import { getDddsData } from '../../../../services/ddd';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate';
const cors = microCors();

async function citiesOfDdd(request, response) {
  const requestedDdd = request.query.ddd;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const allDddData = await getDddsData();

    const dddData = allDddData.filter(({ ddd }) => ddd === requestedDdd);

    if (dddData.length === 0) {
      response.status(404);
      response.json({
        name: 'ddd_error',
        message: 'DDD não encontrado',
        type: 'DDD_NOT_FOUND',
      });

      return;
    }

    const { state } = dddData[0];

    const cities = dddData.map((ddd) => ddd.city);

    const dddResult = {
      state,
      cities,
    };

    response.status(200);
    response.json(dddResult);
  } catch (error) {
    response.status(500);
    response.json({
      name: 'ddd_error',
      message: 'Todos os serviços de DDD retornaram erro.',
      type: 'service_error',
    });
  }
}

export default cors(citiesOfDdd);
