import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import { getDadosServidoresEstagiarios } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosEstagiarios(request, response) {
  try {
    const result = await getDadosServidoresEstagiarios();
    return response.status(result.status).json(result.data);
  } catch (error) {
    if (error.response.status === 400) {
      throw new BadRequestError({ message: error.response.data.message });
    }
    if (error.response.status === 404) {
      throw new NotFoundError({ message: error.response.data.message });
    }
    throw error;
  }
}

export default app().get(getDadosEstagiarios);
