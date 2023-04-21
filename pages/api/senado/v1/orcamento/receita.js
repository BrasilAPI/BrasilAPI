import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosReceita } from '@/services/dados-abertos-br/senado-orcamento';

async function getDadosReceitas(request, response) {
  try {
    const result = await getDadosReceita();
    return response.status(result.status).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosReceitas);
