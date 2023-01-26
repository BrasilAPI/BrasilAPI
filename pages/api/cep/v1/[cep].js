import cep from 'cep-promise';

import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';

const providers = ['correios', 'viacep', 'widenet', 'correios-alt'];

async function Cep(request, response) {
  try {
    const requestedCep = request.query.cep;

    const cepResult = await cep(requestedCep, {
      providers,
    });

    response.status(200);
    return response.json(cepResult);
  } catch (error) {
    if (error.name !== 'CepPromiseError') {
      throw error;
    }

    if (error.type === 'validation_error') {
      throw new BadRequestError(error);
    }

    if (error.type === 'service_error') {
      throw new NotFoundError(error);
    }
  }
}

export default app({ cache: 172800 }).get(Cep);
