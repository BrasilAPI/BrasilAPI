import microCors from 'micro-cors';
import { getStateCities } from '../../../../../services/state-cities';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const stateCities = async (request, response) => {
  try {
    const { uf } = request.query;
    const municipios = await getStateCities(uf);
    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
    response.status(200).json(municipios);
  } catch (err) {
    response.status(404).json({
      name: 'cities_error',
      message: 'Cidades não encontradas para o estado solicitado',
      type: 'CITIES_NOT_FOUND',
    });
  }
};

export default cors(stateCities);
