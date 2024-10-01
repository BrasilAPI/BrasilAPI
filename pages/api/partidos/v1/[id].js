import app from '@/app';
import { getParty } from '@/services/partidos/get';

const action = async (request, response) => {
  const id = Number(request.query.id);

  const party = await getParty(id);

  if (!party) {
    response.status(404);
    response.json({
      message: 'Código do partido não encontrado',
      type: 'PARTY_CODE_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(party);
};

export default app().get(action);
