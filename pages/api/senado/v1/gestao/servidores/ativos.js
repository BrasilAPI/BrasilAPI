import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosServidoresAtivos } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosAtivos(request, response) {
  try {
    const result = await getDadosServidoresAtivos();
    return response.status(result.status).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosAtivos);
