import app from '@/app';

import BaseError from '@/errors/BaseError';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';
import NotFoundError from '@/errors/NotFoundError';

import { validateIsbn } from '@/services/isbn/tools';
import cblSearch from '@/services/isbn/cbl';
import googleBooksSearch from '@/services/isbn/googleBooks';
import mercadoEditorialSearch from '@/services/isbn/mercadoEditorial';
import openLibrarySearch from '@/services/isbn/openLibrary';

const PROVIDER_MAP = {
  cbl: cblSearch,
  'google-books': googleBooksSearch,
  'mercado-editorial': mercadoEditorialSearch,
  'open-library': openLibrarySearch,
};

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

async function isbnSearch(isbn, providers = null) {
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

    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

    if (!validateIsbn(requestedIsbn)) {
      response.status(400);

      throw new BadRequestError({ message: 'ISBN inválido' });
    }

    const result = await isbnSearch(requestedIsbn, providers);

    return response.status(200).json(result);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    // eslint-disable-next-line no-undef
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
