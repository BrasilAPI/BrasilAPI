import microCors from 'micro-cors';
import { getUfByCode } from '../../../../../services/ibge';
import { logger, baseURL } from '../../../../../services/utils';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const { code } = request.query;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const uf = await getUfByCode(code);
    response.status(200);
    return response.json(uf);
  } catch (error) {
    if (error.message === 'not_found') {
      response.status(404);
      return response.json({
        name: 'NotFoundError',
        message: 'UF não encontrado.',
        type: 'not_found',
      });
    }

    logger({
      message: 'Error fetching data',
      error,
      stack: error.stack,
      baseURL,
    });

    response.status(500);
    return response.json({
      name: 'Internal server error',
      type: 'internal_server_error',
    });
  }
};

export default cors(action);
