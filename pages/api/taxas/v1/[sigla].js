import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import * as selic from 'selic';

const action = async (request, response) => {
  const sigla = request.query.sigla.toLowerCase();
  const taxas = await selic.getRatesList();

  const item = taxas.find((taxa) => taxa.name.toLowerCase() === sigla);

  if (!item) {
    response.status(404);
    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Taxa ou Índice não encontrada.',
      type: 'not_found',
    });
  }

  response.status(200);
  response.json({ nome: item.name, valor: item.apy });
};

export default app().get(action);
