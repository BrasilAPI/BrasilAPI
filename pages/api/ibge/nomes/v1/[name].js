import app from '@/app';
import { getFrequencyByName } from '@/services/ibge/name';

const action = async (request, response) => {
  const { name, sexo, groupBy, localidade } = request.query;

  const names = await getFrequencyByName(name, sexo, groupBy, localidade);

  response.status(200);
  return response.json(names);
};

export default app().get(action);
