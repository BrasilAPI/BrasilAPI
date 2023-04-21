import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosServidoresInativos } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosGestaoInativos(request, response) {
  try {
    const result = await getDadosServidoresInativos();
    return response.status(result.status).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosGestaoInativos);
