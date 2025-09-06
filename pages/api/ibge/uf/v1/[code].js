import app from '@/app';
import { getUfByCode, getUfEstimatePopulationByCode } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { code } = request.query;

  const [ufRes, populationData] = await Promise.all([
    getUfByCode(code),
    getUfEstimatePopulationByCode(code),
  ]);

  const { ufData, status } = ufRes;

  if (!ufData || (Array.isArray(ufData) && ufData.length === 0)) {
    throw new NotFoundError({ message: 'UF não encontrada.' });
  }

  response.status(status);
  return response.json({ ...ufData, ...populationData });
};

export default app().get(action);
