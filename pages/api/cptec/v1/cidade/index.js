import app from '@/app';
import { getAllCitiesData } from '@/services/cptec';

const action = async (request, response) => {
  const allCitiesData = await getAllCitiesData();

  response.status(200);
  response.json(allCitiesData);
};

export default app().get(action);
