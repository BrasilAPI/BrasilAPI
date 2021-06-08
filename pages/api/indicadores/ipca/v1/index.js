import app from '@/app';

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
    response.status(404);
    response.json({
      message: `Valores de ICPA não encontrados`,
      type: 'IPCA_VALUES_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(ipcaValues);
};

export default app().get(action);
