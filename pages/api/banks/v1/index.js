import microCors from 'micro-cors';
import { getBanksData } from '../../../../services/banco-central';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const allBanksData = await getBanksData();

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  response.status(200);
  response.json(allBanksData);
};

export default cors(action);
