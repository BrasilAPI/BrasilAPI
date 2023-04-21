import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosServidoresEstagiarios } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosEstagiarios(request, response) {
  try {
    const result = await getDadosServidoresEstagiarios();
    return response.status(result.status).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosEstagiarios);
