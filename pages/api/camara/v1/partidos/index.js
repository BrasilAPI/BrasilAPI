import microCors from 'micro-cors';
import getPartidos from '../../../../../services/camara/partidos';

const CACHE_CONTROL_HEADER_VALUE = 'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

async function Partidos(request, response) {
  const { ordem, ordenarPor } = request.query;
  
  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const partidosResult = await getPartidos({ ordem, ordenarPor });

    response.status(200);
    response.json({ status: 'ok', partidos: partidosResult });
  } catch (error) {
    response.status(500);
    response.json({ status: 'error', message: error.message});
  }
}

export default cors(Partidos);
