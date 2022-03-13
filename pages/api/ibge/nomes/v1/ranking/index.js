import app from '@/app';
import { getRanking } from '@/services/ibge/name';

const action = async (request, response) => {
  const { decada, sexo, localidade } = request.query;

  const names = await getRanking(decada, sexo, localidade);

  response.status(200);
  return response.json(names);
};

export default app().get(action);
