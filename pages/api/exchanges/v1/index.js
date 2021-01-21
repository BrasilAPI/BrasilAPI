import microCors from 'micro-cors';
import { getExchangesData } from '../../../../services/cvm';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const allExchangesData = await getExchangesData();

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  response.status(200);
  response.json(allExchangesData);
};

export default cors(action);
