import app from '@/app';
import { getStateCities, CODIGOS_ESTADOS } from '@/services/ibge/wikipedia';
import { getDistrictsByUf } from '@/services/ibge/gov';

import NotFoundError from '@/errors/not-found';

const action = async (request, response) => {
  try {
    const { uf } = request.query;

    if (!uf || !CODIGOS_ESTADOS[uf.toUpperCase()]) {
      throw new Error('EstadoNotFoundException');
    }

    const data = await getDistrictsByUf(uf).catch(() => getStateCities(uf));
    return response.status(200).json(data);
  } catch (err) {
    if (err.message === 'EstadoNotFoundException') {
      throw new NotFoundError({ message: 'UF não encontrada' });
    } else {
      throw err;
    }
  }
};

export default app().get(action);
