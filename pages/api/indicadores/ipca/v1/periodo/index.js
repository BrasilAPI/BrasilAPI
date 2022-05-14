import app from '@/app';

import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';

import { fetchIPCAByInterval } from '@/services/banco-central/indicators/ipca';

function ansiToBacenDate(dateString) {
  const [year, month, day] = dateString.split('-');

  const isValidDate = new Date(dateString).toString() !== 'Invalid Date';

  if (!isValidDate || !year || !month || !day) {
    throw new BadRequestError({
      message: `Data inválida: ${dateString}`,
    });
  }

  return `${day}/${month}/${year}`;
}

const action = async (request, response) => {
  const { startDate, endDate } = request.query;

  if (!startDate || !endDate) {
    throw new BadRequestError({
      message: `Parâmetros startDate ou endDate não encontrados.`,
      type: 'INTERVAL_IPCA_PARAMS_NOT_FOUND',
    });
  }

  const formattedStartDate = ansiToBacenDate(startDate);
  const formattedEndDate = ansiToBacenDate(endDate);

  const ipcaValues = await fetchIPCAByInterval({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
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
