import microCors from 'micro-cors';
import { getStateCities } from '@/services/ibge/wikipedia';
import { getDistrictsByUf } from '@/services/ibge/gov';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const { uf } = request.query;

  const data = await getDistrictsByUf(uf).catch(() => getStateCities(uf));

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  response.status(200).json(data);
};

export default cors(action);
