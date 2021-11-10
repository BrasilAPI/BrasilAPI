import app from '@/app';
import * as selic from 'selic';

const action = async (request, response) => {
  const taxas = await selic.getRatesList();

  response.status(200);
  response.json(taxas.map((taxa) => ({ nome: taxa.name, valor: taxa.apy })));
};

export default app().get(action);
