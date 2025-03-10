import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosQuantitativos } from '@/services/dados-abertos-br/senado-quantitativos';

async function getDadosSenadoQuantitativo(request, response) {
  try {
    const result = await getDadosQuantitativos();
    return response.status(200).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosSenadoQuantitativo);
