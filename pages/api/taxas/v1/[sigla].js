import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import * as selic from 'selic';

const action = async (request, response) => {
  const sigla = request.query.sigla.toLowerCase();

  if (!['selic', 'ipca', 'cdi'].includes(sigla.toLowerCase())) {
    throw new NotFoundError({
      message: 'Taxa ou Índice não encontrada.',
    });
  }

  const taxas = await selic.getRatesObject();

  const valor = taxas[sigla];

  response.status(200);
  response.json({ nome: sigla.toUpperCase(), valor });
};

export default app().get(action);
