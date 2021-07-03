import app from '@/app';

import NotFoundError from '@/errors/NotFoundError';

import {
  fetchHistoricalIPCA,
  fetchLastIPCAValues,
} from '@/services/banco-central/indicators/ipca';

const action = async (request, response) => {
  const { last } = request.query;

  const ipcaValues = last
    ? await fetchLastIPCAValues(last)
    : await fetchHistoricalIPCA();

  if (!ipcaValues) {
    throw new NotFoundError({
      message: `Valores de ICPA não encontrado.`,
      type: 'IPCA_VALUES_NOT_FOUND',
    });
  }

  response.status(200);
  response.json(ipcaValues);
};

export default app().get(action);
