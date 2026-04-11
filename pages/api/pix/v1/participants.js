import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { getPixParticipants, formatCsvFile } from '@/services/pix/participants';

const obtainPixParticipantList = async (actual = true) => {
  try {
    const today = new Date();
    // Handle weekend cases, as BCB does not update data on Saturdays and Sundays
    let response;
    if (today.getDay() === 0 || today.getDay() === 6) {
      response = await getPixParticipants(false, today.getDay() === 0 ? 2 : 1);
    } else {
      response = await getPixParticipants();
    }

    return response;
  } catch (error) {
    if (actual && error.response.status === 404) {
      return getPixParticipants(false);
    }

    throw new InternalError({
      status: 500,
      message: `Erro ao obter as informações do BCB ou informações inexistentes`,
      name: 'PIX_LIST_ERROR',
      type: 'PIX_LIST_ERROR',
    });
  }
};

const action = async (request, response) => {
  try {
    const pixParticipantsList = await obtainPixParticipantList();

    const parsedData = formatCsvFile(pixParticipantsList);

    response.status(200);
    response.json(parsedData);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      status: 500,
      message: `Erro ao obter as informações do BCB`,
      name: 'PIX_LIST_ERROR',
      type: 'PIX_LIST_ERROR',
    });
  }
};

/**
 * Cache de 21600s (6 horas) devido a não saber que horas os dados são gerados pelo BCB.
 * Logo foi utilizado um cache longo para caso não exista as infos, utilize a do dia anterior como base, já que não é um dado que tem alta atualização
 */

export default app({ cache: 21600 }).get(action);
