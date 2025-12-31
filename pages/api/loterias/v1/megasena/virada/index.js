import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getMegaDaVirada } from '@/services/loterias';

async function getUltimaMegaDaVirada(request, response) {
  try {
    // Busca a Mega da Virada do ano atual
    const anoAtual = new Date().getFullYear();
    const resultado = await getMegaDaVirada(anoAtual);

    return response.status(200).json(resultado);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao buscar Mega da Virada.',
      type: 'loteria_error',
    });
  }
}

export default app().get(getUltimaMegaDaVirada);
