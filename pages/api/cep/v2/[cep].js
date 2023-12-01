import cepPromise from 'cep-promise';

import app from '@/app';
import fetchGeocoordinateFromBrazilLocation from '../../../../lib/fetchGeocoordinateFromBrazilLocation';

const providers = ['correios', 'viacep', 'widenet', 'correios-alt'];

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

async function getCepFromCepPromise(requestedCep) {
  return cepPromise(requestedCep, { providers });
}

async function Cep(request, response) {
  const requestedCep = request.query.cep;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const cepFromCepPromise = await getCepFromCepPromise(requestedCep);
    const location = await fetchGeocoordinateFromBrazilLocation(
      cepFromCepPromise
    );

    response.status(200);
    response.json({ ...cepFromCepPromise, location });
  } catch (error) {
    if (error.name === 'CepPromiseError') {
      switch (error.type) {
        case 'validation_error':
          response.status(400);
          break;
        case 'service_error':
          response.status(404);
          break;
        default:
          break;
      }

      response.json(error);
      return;
    }

    response.status(500);
    response.json(error);
  }
}

export default app({ cache: 172800 }).get(Cep);
