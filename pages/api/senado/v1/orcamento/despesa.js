import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosDespesa } from '@/services/dados-abertos-br/senado-orcamento';

async function getDadosDespesas(request, response) {
  try {
    const result = await getDadosDespesa();
    return response.status(result.status).json(result.data.despesas);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosDespesas);
