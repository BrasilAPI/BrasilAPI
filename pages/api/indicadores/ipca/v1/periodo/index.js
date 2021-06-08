import app from '@/app';

import { fetchIPCAByInterval } from '@/services/banco-central/indicators/ipca';

const action = async (request, response) => {
  const { startDate, endDate } = request.query;

  if (!startDate || !endDate) {
    response.status(400);
    response.json({
      message: `Parâmetros startDate ou endDate não encontrados.`,
      type: 'INTERVAL_IPCA_PARAMS_NOT_FOUND',
    });

    return;
  }

  const ipcaValues = await fetchIPCAByInterval({
    startDate,
    endDate,
  });

  if (!ipcaValues) {
    response.status(404);
    response.json({
      message: `Valores de ICPA para o intervalo ${startDate} - ${endDate} não encontrados`,
      type: 'INTERVAL_IPCA_VALUES_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(ipcaValues);
};

export default app().get(action);
