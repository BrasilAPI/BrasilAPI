import app from '../../../../app';
import { getCnpjData } from '../../../../services/cnpj';

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
    return response.json({
      message: `CNPJ ${request.query.cnpj} não encontrado.`,
    });
  }

  response.status(result.status);
  return response.json(result.data);
}

async function cnpjData(request, response) {
  try {
    const result = await getCnpjData(request.query.cnpj);

    return responseProxy(request, response, result);
  } catch (error) {
    if (error.response.status >= 400 && error.response.status < 500) {
      return responseProxy(request, response, error.response);
    }

    response.status(error.response.status);
    return response.json(error);
  }
}

export default app().get(cnpjData);
