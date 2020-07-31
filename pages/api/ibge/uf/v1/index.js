import microCors from 'micro-cors';
import { getUfs } from '../../../../../services/ibge';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (_, response) => {
  const { data, status } = await getUfs();

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  response.status(status);
  response.json(data);
};

export default cors(action);
