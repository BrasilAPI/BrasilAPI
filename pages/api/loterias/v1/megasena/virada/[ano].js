import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getMegaDaVirada } from '@/services/loterias';

async function getMegaDaViradaByYear(request, response) {
  try {
    const { ano } = request.query;

    // Se não informar o ano, busca o ano atual
    const anoBuscado = ano || new Date().getFullYear();

    const resultado = await getMegaDaVirada(anoBuscado);

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

export default app().get(getMegaDaViradaByYear);
