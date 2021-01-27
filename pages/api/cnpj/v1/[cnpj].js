import microCors from 'micro-cors';
import { getCnpjData } from '../../../../services/cnpj';

const cors = microCors();
const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate';

async function cnpjData(request, response) {
  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
  try {
    const result = await getCnpjData(request.query.cnpj);
    response.status(result.status);
    response.json(result.data);
  } catch (error) {
    response.status(500);
    response.json(error.response.data);
  }
}

export default cors(cnpjData);
