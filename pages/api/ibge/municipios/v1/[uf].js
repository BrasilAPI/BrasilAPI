import { Promise } from 'bluebird';

import app from '@/app';
import { getStateCities, CODIGOS_ESTADOS } from '@/services/ibge/wikipedia';
import { getContiesByUf } from '@/services/ibge/gov';

import NotFoundError from '@/errors/NotFoundError';
import { getCities } from '@/services/dados-abertos-br/cities';

const getData = async (uf) => {
  const data = await Promise.any([getContiesByUf(uf), getStateCities(uf), getCities(uf)]);

  return data
    .map((item) => ({ ...item, nome: item.nome.toUpperCase() }))
    .sort((a, b) => a.codigo_ibge - b.codigo_ibge);
};

const action = async (request, response) => {
  try {
    const { uf } = request.query;

    if (!uf || !CODIGOS_ESTADOS[uf.toUpperCase()]) {
      throw new Error('EstadoNotFoundException');
    }

    const data = await getData(uf);
    return response.status(200).json(data);
  } catch (err) {
    if (err.message === 'EstadoNotFoundException') {
      throw new NotFoundError({ message: 'UF não encontrada' });
    }

    throw err;
  }
};

export default app().get(action);
