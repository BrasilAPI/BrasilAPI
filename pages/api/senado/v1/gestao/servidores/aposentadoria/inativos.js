import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import { getDadosServidoresInativos } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosGestaoInativos(request, response) {
  try {
    const result = await getDadosServidoresInativos();
    return response.status(200).json(result.data);
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

export default app().get(getDadosGestaoInativos);
