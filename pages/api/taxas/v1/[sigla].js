import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import * as selic from 'selic';

const action = async (request, response) => {
  const sigla = request.query.sigla.toLowerCase();
  const taxas = await selic.getRatesObject();

  const valor = taxas[sigla];

  if (!valor) {
    response.status(404);
    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Taxa ou Índice não encontrada.',
      type: 'not_found',
    });
  }

  response.status(200);
  response.json({ nome: sigla.toUpperCase(), valor });
};

export default app().get(action);
