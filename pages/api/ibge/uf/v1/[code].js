import app from '@/app';
import {
  getUfByCode,
  getUfEstimatePopulationByCode,
  getUfTerritorialAreaByCode,
} from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';

const action = async (request, response) => {
  const { code } = request.query;

  const { data: ufData, status } = await getUfByCode(code);

  if (!ufData || (Array.isArray(ufData) && ufData.length === 0)) {
    throw new NotFoundError({ message: 'UF não encontrada.' });
  }

  const [populationData, territorialAreaData] = await Promise.all([
    getUfEstimatePopulationByCode(code),
    getUfTerritorialAreaByCode(code),
  ]);

  response.status(status);
  return response.json({
    ...ufData,
    ...populationData,
    ...territorialAreaData,
  });
};

export default app().get(action);
