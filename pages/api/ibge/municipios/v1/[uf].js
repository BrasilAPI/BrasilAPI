import { Promise } from 'bluebird';

import app from '@/app';
import { getStateCities, CODIGOS_ESTADOS } from '@/services/ibge/wikipedia';
import { getContiesByUf } from '@/services/ibge/gov';
import { getCities } from '@/services/dados-abertos-br/cities';

import { rejectWhenEmptyArray } from '@/util/rejectWhenEmptyArray';

import NotFoundError from '@/errors/NotFoundError';
import InternalError from '@/errors/InternalError';
import BaseError from '@/errors/BaseError';

const getData = async (uf, argsProviders = null) => {
  const providers =
    !argsProviders || argsProviders.length === 0
      ? ['dados-abertos-br', 'gov']
      : argsProviders;
  const promises = [];

  if (providers.includes('wikipedia')) {
    promises.push(getStateCities(uf).then(rejectWhenEmptyArray));
  }
  if (providers.includes('dados-abertos-br')) {
    promises.push(getCities(uf).then(rejectWhenEmptyArray));
  }
  if (providers.includes('gov')) {
    promises.push(getContiesByUf(uf).then(rejectWhenEmptyArray));
  }

  const data = await Promise.any(promises);

  return data
    .map((item) => ({ ...item, nome: item.nome.toUpperCase() }))
    .sort((a, b) => a.codigo_ibge - b.codigo_ibge);
};

const action = async (request, response) => {
  try {
    const { uf } = request.query;
    const providers = request.query.providers
      ? request.query.providers.split(',')
      : null;

    if (!uf || !CODIGOS_ESTADOS[uf.toUpperCase()]) {
      throw new NotFoundError({
        message: 'UF não encontrada.',
        name: 'EstadoNotFoundException',
      });
    }

    const data = await getData(uf, providers);
    return response.status(200).json(data);
  } catch (err) {
    if (err instanceof BaseError) {
      throw err;
    }

    throw new InternalError({
      message: 'Erro ao buscar UF.',
      name: 'EstadoInternalException',
    });
  }
};

export default app().get(action);
