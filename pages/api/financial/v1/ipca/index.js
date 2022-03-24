import app from '@/app';
import { lastIpca } from '@/services/financial/ipca';

const action = async (request, response) => {
  const ipca = await lastIpca();

  if (!ipca) {
    response.status(404).json({
      message: 'Não foi possível localizar o último IPCA apurado',
    });

    return;
  }

  response.status(200).json(ipca);
};

export default app().get(action);
