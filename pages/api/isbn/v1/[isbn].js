import { Promise, AggregateError } from 'bluebird';

import app from '@/app';

import BaseError from '@/errors/BaseError';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { isValidIsbn } from '@/services/isbn/tools';
import searchInCbl from '@/services/isbn/cbl';
import searchInGoogleBooks from '@/services/isbn/googleBooks';
import searchInMercadoEditorial from '@/services/isbn/mercadoEditorial';
import searchInOpenLibrary from '@/services/isbn/openLibrary';

const PROVIDER_MAP = {
  cbl: searchInCbl,
  'google-books': searchInGoogleBooks,
  'mercado-editorial': searchInMercadoEditorial,
  'open-library': searchInOpenLibrary,
};

async function searchIsbn(isbn, providers = null) {
  let promises = [];
  const allProviders = Object.values(PROVIDER_MAP);

  if (!providers || providers.length === 0) {
    promises = allProviders;
  } else {
    promises = providers
      .map((provider) => PROVIDER_MAP[provider])
      .filter(Boolean);

    if (promises.length === 0) {
      promises = allProviders;
    }
  }

  const data = await Promise.any(promises.map((promise) => promise(isbn)));

  return data;
}

async function action(request, response) {
  try {
    const requestedIsbn = request.query.isbn.replace(/-/g, '');
    const providers = request.query.providers
      ? request.query.providers.split(',')
      : null;

    if (!isValidIsbn(requestedIsbn)) {
      throw new BadRequestError({ message: 'ISBN inválido' });
    }

    const result = await searchIsbn(requestedIsbn, providers);

    return response.status(200).json(result);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    if (error instanceof AggregateError || Array.isArray(error)) {
      const errors = error.errors || error;
      const isNotFound = errors.some((err) => err instanceof NotFoundError);

      if (isNotFound) {
        throw new NotFoundError({ message: 'ISBN não encontrado' });
      }
    }

    throw new InternalError({
      message: 'Todos os serviços de ISBN retornaram erro.',
    });
  }
}

export default app().get(action);
