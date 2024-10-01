/* eslint-disable no-console */
import app from '@/app';
import { getParties } from '@/services/partidos/get';

const action = async (request, response) => {
  try {
    const allParties = await getParties();


    response.status(200);
    response.json(allBanksData);
  } catch (error) {
    console.error('Erro ao obter partidos:', error);
    response.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export default app().get(action);
