import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosServidoresDisponibilizados } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosDisponibilizados(request, response) {
  try {
    const result = await getDadosServidoresDisponibilizados();
    return response.status(result.status).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosDisponibilizados);
