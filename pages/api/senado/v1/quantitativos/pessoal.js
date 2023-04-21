import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosQuantitativoPessoal } from '@/services/dados-abertos-br/senado-quantitativos';

async function getDadosSenadoQuantitativoPessoal(request, response) {
  try {
    const result = await getDadosQuantitativoPessoal();
    return response.status(result.status).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosSenadoQuantitativoPessoal);
