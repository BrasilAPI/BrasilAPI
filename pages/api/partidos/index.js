/* eslint-disable no-console */
import app from '@/app';
import { getParties } from '@/services/partidos/get';

const action = async (request, response) => {
  try {
    const allBanksData = await getParties();

    if (!allBanksData || allBanksData.length === 0) {
      console.error('Nenhum dado encontrado');
      response.status(404).json({ message: 'Nenhum dado encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter partidos:', error);
    response.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export default app().get(action);
