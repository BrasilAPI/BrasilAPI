import microCors from 'micro-cors';
import { getUfByCode } from '../../../../../services/ibge';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const { code } = request.query;
  const { data, status } = await getUfByCode(code);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if (Array.isArray(data) && !data.length) {
    response.status(404);
    response.json({
      name: 'NotFoundError',
      message: 'UF não encontrado.',
      type: 'not_found',
    });
  } else {
    response.status(status);
    response.json(data);
  }
};

export default cors(action);
