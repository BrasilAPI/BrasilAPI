import microCors from 'micro-cors';
import getPartido from '../../../../../services/camara/partido';

const CACHE_CONTROL_HEADER_VALUE = 'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

async function Partido(request, response) {
  const { partido, incluirMembros } = request.query;
  
  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const partidoResult = await getPartido({ partido, incluirMembros });

    response.status(200);
    response.json({ status: 'ok', info: partidoResult });
  } catch (error) {
    if(error.name === 'PartidosError') {
      switch(error.type) {
        case 'not_found':
          response.status(404);
          break;
        default:
          response.status(500);
      }

      response.json({ status: 'error', message: error.message });
      return;
    }

    response.status(500);
    response.json({ status: 'error', message: error.message});
  }
}

export default cors(Partido);
