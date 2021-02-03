import microCors from 'micro-cors';
import { getCnpjData } from '../../../../services/cnpj';

const cors = microCors();
const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate';

// Takes BrasilAPI's request and response objects, together with Minha
// Receita's response to build the final user HTTP response — including a
// different treatment of the 204 use case (valid  but not existing CNPJ).
//
// This logic was extracted so we can use the same function in the `try` and
// `catch` branches of the main handler.
function responseProxy(request, response, result) {
  // the CNPJ is valid but does not exist
  if (result.status === 204) {
    response.status(404);
    response.json({ message: `CNPJ ${request.query.cnpj} não encontrado.` });
    return;
  }

  response.status(result.status);
  response.json(result.data);
}

async function cnpjData(request, response) {
  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
  try {
    const result = await getCnpjData(request.query.cnpj);
    responseProxy(request, response, result);
  } catch (error) {
    if (error.response.status >= 400 && error.response.status < 500) {
      responseProxy(request, response, error.response);
    } else {
      response.status(500);
      response.json(error);
    }
  }
}

export default cors(cnpjData);
