import app from '@/app';
import { getParties } from '@/services/partidos/get';

const action = async (request, response) => {
  const page = parseInt(request.query.pagina, 10) || 1;
  const itemsPerPage = parseInt(request.query.itens, 10) || 15;

  const parties = await getParties(page, itemsPerPage);

  response.status(200);
  response.json(parties);
};

export default app().get(action);
