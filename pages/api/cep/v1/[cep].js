import cep from 'cep-promise';
import { normalizeServiceErrors } from '@/util/cep-error-handler';

export default async function handler(request, response) {
  const { cep: cepParam } = request.query;

  try {
    const cepData = await cep(cepParam);
    return response.status(200).json(cepData);
  } catch (err) {
    const errorResponse = { ...err };
    
    if (err.errors) {
      errorResponse.errors = normalizeServiceErrors(err.errors);
    }

    return response.status(404).json(errorResponse);
  }
}