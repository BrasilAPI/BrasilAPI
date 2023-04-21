import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosServidoresEfetivos } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosEfetivos(request, response) {
  try {
    const result = await getDadosServidoresEfetivos();
    return response.status(200).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosEfetivos);
