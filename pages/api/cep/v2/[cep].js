import app from '@/app';
import { fetchCep } from '@/services/cep/cep';
import fetchGeocoordinateFromBrazilLocation from '../../../../lib/fetchGeocoordinateFromBrazilLocation';
import fetchTimezoneNameFromBrazilLocation from '../../../../lib/fetchTimezoneNameFromBrazilLocation';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

async function getCepWithLocation(request, response) {
  const requestedCep = request.query.cep;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const cepFromCepPromise = await fetchCep(requestedCep);
    const location = await fetchGeocoordinateFromBrazilLocation(
      cepFromCepPromise
    );

    const timezoneName = await fetchTimezoneNameFromBrazilLocation({
      ...location,
      ...cepFromCepPromise,
    });

    if (!cepFromCepPromise.street) {
      cepFromCepPromise.street = null;
    }

    if (!cepFromCepPromise.neighborhood) {
      cepFromCepPromise.neighborhood = null;
    }

    response.status(200);
    response.json({ ...cepFromCepPromise, timezoneName, location });
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
    } else if (error.type === 'bad_request') {
      throw error;
    }

    response.status(500);
    response.json(error);
  }
}

export default app({ cache: 172800 }).get(getCepWithLocation);
