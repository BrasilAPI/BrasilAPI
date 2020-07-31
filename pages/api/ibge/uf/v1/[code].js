import microCors from 'micro-cors';
import { getUfByCode } from '../../../../../services/ibge';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const code = Number(request.query.code);
  const { data, status } = await getUfByCode(code);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if (Array.isArray(data) && !data.length) {
    response.status(404);
    response.json(data);
  } else {
    response.status(status);
    response.json(data);
  }
};

export default cors(action);
