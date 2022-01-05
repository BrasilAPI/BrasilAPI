import app from '@/app';
import { getLegalNatureList } from '@/services/legal-nature';

const action = (request, response) => {
  const legalNatureList = getLegalNatureList();
  response.status(200);
  response.json(legalNatureList);
};

export default app().get(action);
