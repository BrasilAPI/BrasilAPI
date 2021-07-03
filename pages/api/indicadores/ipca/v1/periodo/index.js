import app from '@/app';

import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';

import { fetchIPCAByInterval } from '@/services/banco-central/indicators/ipca';

const action = async (request, response) => {
  const { startDate, endDate } = request.query;

  if (!startDate || !endDate) {
    throw new BadRequestError({
      message: `Parâmetros startDate ou endDate não encontrados.`,
      type: 'INTERVAL_IPCA_PARAMS_NOT_FOUND',
    });
  }

  const ipcaValues = await fetchIPCAByInterval({
    startDate,
    endDate,
  });

  if (!ipcaValues) {
    throw new NotFoundError({
      message: `Valores de ICPA para o intervalo ${startDate} - ${endDate} não encontrados.`,
      type: 'INTERVAL_IPCA_VALUES_NOT_FOUND',
    });
  }

  response.status(200);
  response.json(ipcaValues);
};

export default app().get(action);
