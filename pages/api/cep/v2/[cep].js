import app from '@/app';
import { fetchCep } from '@/services/cep/cep';
import { getDddsData, findDddByCity } from '@/services/ddd';
import fetchGeocoordinateFromBrazilLocation from '../../../../lib/fetchGeocoordinateFromBrazilLocation';
import fetchTimezoneNameFromBrazilLocation from '../../../../lib/fetchTimezoneNameFromBrazilLocation';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

function isDddRequested(dddQuery) {
  return typeof dddQuery === 'string' && dddQuery.toLowerCase() === 'true';
}

function fetchDddsDataSafely() {
  return getDddsData().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('[cep-v2] Failed to fetch DDD data from Anatel:', {
      error: error.message,
      code: error.code,
      status: error.response?.status,
    });
    return null;
  });
}

async function getCepWithLocation(request, response) {
  const requestedCep = request.query.cep;
  const shouldIncludeDdd = isDddRequested(request.query.ddd);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const cepFromCepPromise = await fetchCep(requestedCep);

    // Só consulta a Anatel após o CEP ser encontrado, em paralelo com a
    // geolocalização e o fuso; nunca rejeita.
    const dddsDataPromise = shouldIncludeDdd ? fetchDddsDataSafely() : null;

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

    const responseBody = { ...cepFromCepPromise, timezoneName, location };

    if (shouldIncludeDdd) {
      const dddsData = await dddsDataPromise;
      responseBody.ddd = findDddByCity(dddsData, {
        ibgeCode: cepFromCepPromise.ibge?.city,
        state: cepFromCepPromise.state,
        city: cepFromCepPromise.city,
      });
    }

    response.status(200);
    response.json(responseBody);
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

      response.json({
        name: error.name,
        message: error.message,
        type: error.type,
        errors: error.errors || [],
      });
      return;
    } else if (error.type === 'bad_request') {
      throw error;
    }

    response.status(500);
    response.json({
      message: error.message || 'Erro interno do servidor',
      type: 'internal_error',
      name: error.name || 'InternalServerError',
    });
  }
}

export default app({ cache: 172800 }).get(getCepWithLocation);
