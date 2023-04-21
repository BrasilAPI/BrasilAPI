import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosServidoresTerceirizados } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosTerceirizados(request, response) {
  try {
    const result = await getDadosServidoresTerceirizados();
    return response.status(result.status).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosTerceirizados);
