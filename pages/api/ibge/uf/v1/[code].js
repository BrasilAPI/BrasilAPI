import microCors from 'micro-cors';
import { getUfByCode } from '../../../../../services/ibge';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const code = Number(request.query.code);
  const uf = await getUfByCode(code);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  response.status(200);
  response.json(uf);
};

export default cors(action);
