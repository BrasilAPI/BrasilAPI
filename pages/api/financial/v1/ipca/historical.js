import app from '@/app';
import { historicalIpca } from '@/services/financial/ipca';

const action = async (request, response) => {
  const ipca = await historicalIpca();

  if (!ipca) {
    response.status(404).json({
      message: 'Não foi possível localizar o histórico do IPCA',
    });

    return;
  }

  response.status(200).json(ipca);
};

export default app().get(action);
