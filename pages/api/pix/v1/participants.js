import app from '@/app';
import InternalError from '@/errors/InternalError';
import { getParticipants, formatCsvFile } from '@/services/pix/participants';

const obtainList = async (actual = true) => {
  try {
    const response = await getParticipants();

    return response;
  } catch (error) {
    if (actual && error.response.status === 404) {
      return getParticipants(false);
    }

    throw error;
  }
};

const action = async (request, response) => {
  let pixParticipantsList = '';

  try {
    pixParticipantsList = await obtainList();
  } catch (error) {
    throw new InternalError({
      status: 500,
      message: `Erro ao obter as informações do BCB`,
      name: 'PIX_LIST_ERROR',
      type: 'PIX_LIST_ERROR',
    });
  }

  const parsedData = formatCsvFile(pixParticipantsList);

  response.status(200);
  response.json(parsedData);
};

export default app({ cache: 21600 }).get(action);
