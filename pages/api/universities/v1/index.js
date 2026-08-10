import microCors from 'micro-cors';
import { getUniversities } from '../../../../services/universities';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate';
const cors = microCors();

async function Universities(request, response) {
  try {
    const universities = await getUniversities();

    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
    response.status(200);

    response.json(universities);
  } catch (error) {
    response.status(500);

    response.json({
      message: error.message || 'Erro interno do servidor',
      type: 'internal_error',
      name: error.name || 'InternalServerError',
    });
  }
}

export default cors(Universities);
