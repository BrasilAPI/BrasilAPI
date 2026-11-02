import app from '@/app';
import NotFoundError from '@/errors/NotFoundError';
import * as selic from 'selic';

// Each rate is fetched on its own so a single request only depends on the
// upstream provider (BCB or B3) that actually serves the requested rate.
const RATE_FETCHERS = {
  selic: selic.getSelicRate,
  ipca: selic.getIpcaRate,
  cdi: selic.getCdiRate,
};

const action = async (request, response) => {
  const sigla = request.query.sigla.toLowerCase();
  const fetchRate = RATE_FETCHERS[sigla];

  if (!fetchRate) {
    throw new NotFoundError({
      message: 'Taxa ou Índice não encontrada.',
    });
  }

  const valor = await fetchRate();

  return response.status(200).json({ nome: sigla.toUpperCase(), valor });
};

export default app().get(action);
