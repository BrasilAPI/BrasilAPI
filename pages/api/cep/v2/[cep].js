import microCors from 'micro-cors';
import cepPromise from 'cep-promise';

import fetchGeocoordinateFromBrazilLocation from '../../../../lib/fetchGeocoordinateFromBrazilLocation';

const providers = ['correios', 'viacep', 'widenet'];

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

async function getCepFromCepPromise(requestedCep) {
  return cepPromise(requestedCep, { providers });
}

async function Cep(request, response) {
  if (
    request.headers['user-agent'] === 'axios/0.21.4' &&
    !request.headers.origin &&
    (request.url.includes('/api/cep/v2/1') ||
      request.url.includes('/api/cep/v2/0'))
  ) {
    response.status(508);
    response.send(
      'please stop abusing our public API, join our slack to chat a bit https://join.slack.com/t/brasilapi/shared_invite/zt-1k9w5h27p-4yLWoOQqIMgwqunnHCyWCQ'
    );
    return;
  }

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

export default cors(Cep);
