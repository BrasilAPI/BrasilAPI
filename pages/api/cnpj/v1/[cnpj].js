import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import ServiceUnavailableError from '@/errors/ServiceUnavailableError';
import { getCnpjData } from '@/services/cnpj';

async function getCnpjInfo(request, response) {
  try {
    const result = await getCnpjData(request.query.cnpj);
    return response.status(result.status).json(result.data);
  } catch (error) {
    if (error instanceof ServiceUnavailableError) {
      response.setHeader('Cache-Control', 'no-store');
      throw error;
    }
    if (error.response?.status === 400) {
      throw new BadRequestError({ message: error.response.data.message });
    }
    if (error.response?.status === 404) {
      throw new NotFoundError({ message: error.response.data.message });
    }
    throw error;
  }
}

export default app().get(getCnpjInfo);
