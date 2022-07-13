import app from '@/app';
import * as selic from 'selic';

const action = async (_request, response) => {
  const taxas = await selic.getRatesList();

  response.status(200);
  response.json(taxas.map(({ name, apy }) => ({ nome: name, valor: apy })));
};

export default app().get(action);
