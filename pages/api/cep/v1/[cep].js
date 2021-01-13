import cep from 'cep-promise';

import ApiError from 'errors/api-error';

import handle from 'handler';
import { cache } from 'handler/middlewares/cache';

async function getCep(request) {
  const requestedCep = request.query.cep;

  try {
    const cepResult = await cep(requestedCep);

    return { status: 200, body: cepResult };
  } catch (error) {
    if (error.name === 'CepPromiseError') {
      let status = 500;

      if (error.type === 'validation_error') {
        status = 400;
      }

      if (error.type === 'service_error') {
        status = 404;
      }

      throw new ApiError({
        status,
        message: error.message,
        type: error.type,
        data: { name: error.name, errors: error.errors },
      });
    }

    throw error;
  }
}

export default handle(cache(), getCep);
