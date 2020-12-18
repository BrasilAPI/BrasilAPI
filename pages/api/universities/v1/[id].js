import microCors from 'micro-cors';
import { getUniversitiesById } from '../../../../services/universities';

const CACHE_CONTROL_HEADER_VALUE = 'max-age=0, s-maxage=86400, stale-while-revalidate';
const cors = microCors();

async function UniversityById(request, response) {
  const { id } = request.query;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const university = await getUniversitiesById(id);

    if (!university) {
      return response
        .status(404)
        .json({
          message: 'Universidade não encontrada',
          type: 'UNIVERSITY_NOT_FOUND',
        })
    }

    return response
      .status(200)
      .json(university)
  } catch(error) {
    response.status(500);

    response.json(error);
  }
}

export default cors(UniversityById);