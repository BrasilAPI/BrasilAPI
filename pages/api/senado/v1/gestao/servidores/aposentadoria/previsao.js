import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getDadosServidoresPensionistasPrevisao } from '@/services/dados-abertos-br/senado-gestao-pessoas';

async function getDadosGestaoPensionistasPrevisao(request, response) {
  try {
    const result = await getDadosServidoresPensionistasPrevisao();
    return response.status(result.status).json(result.data);
  } catch (error) {
    throw new InternalError({ message: error.response.data.message });
  }
}

export default app().get(getDadosGestaoPensionistasPrevisao);
