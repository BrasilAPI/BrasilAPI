import { Promise } from 'bluebird';

import app from '@/app';
import { getStateCities, CODIGOS_ESTADOS } from '@/services/ibge/wikipedia';
import { getContiesByUf } from '@/services/ibge/gov';
import { getCities } from '@/services/dados-abertos-br/cities';

import { rejectWhenEmptyArray } from '@/util/rejectWhenEmptyArray';

import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import InternalError from '@/errors/InternalError';
import BaseError from '@/errors/BaseError';

const ALLOWED_PROVIDERS = new Set([
  'dados-abertos-br',
  'gov',
  'wikipedia',
]);

const UF_SIGLA_PATTERN = /^[A-Za-z]{2}$/;

const parseProviders = (providersQuery) => {
  if (providersQuery == null || String(providersQuery).trim() === '') {
    return null;
  }

  const parts = String(providersQuery)
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new BadRequestError({
      message: 'Informe pelo menos um provider válido.',
      name: 'ProvidersInvalidException',
    });
  }

  const unknown = [
    ...new Set(parts.filter((p) => !ALLOWED_PROVIDERS.has(p))),
  ];
  if (unknown.length > 0) {
    throw new BadRequestError({
      message: 'Um ou mais providers são inválidos.',
      name: 'ProvidersInvalidException',
      type: 'bad_request',
      errors: unknown,
    });
  }

  return [...new Set(parts)];
};

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
    const { uf: ufParam } = request.query;
    const providersList = parseProviders(request.query.providers);

    const ufRaw =
      ufParam === undefined || ufParam === null ? '' : String(ufParam).trim();

    if (!ufRaw) {
      throw new BadRequestError({
        message: 'UF é obrigatória.',
        name: 'UfBadRequestException',
      });
    }

    if (!UF_SIGLA_PATTERN.test(ufRaw)) {
      throw new BadRequestError({
        message: 'UF inválida. Informe a sigla com duas letras (A-Z).',
        name: 'UfBadRequestException',
      });
    }

    const uf = ufRaw.toUpperCase();

    if (!CODIGOS_ESTADOS[uf]) {
      throw new NotFoundError({
        message: 'UF não encontrada.',
        name: 'EstadoNotFoundException',
      });
    }

    const data = await getData(uf, providersList);
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
