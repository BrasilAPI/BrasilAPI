import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import InternalError from '@/errors/InternalError';
import { fetchCep } from '@/services/cep/cep';
import fetchGeocoordinateFromBrazilLocation from '../../../../lib/fetchGeocoordinateFromBrazilLocation';

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

    if (!cepFromCepPromise.street) {
      cepFromCepPromise.street = null;
    }

    if (!cepFromCepPromise.neighborhood) {
      cepFromCepPromise.neighborhood = null;
    }

    return response.status(200).json({ ...cepFromCepPromise, location });
  } catch (error) {
    if (error.name === 'CepPromiseError') {
      switch (error.type) {
        case 'validation_error':
          throw new BadRequestError({ message: error.message });
        case 'service_error':
          throw new NotFoundError({ message: error.message });
        default:
          break;
      }
    } else if (error.type === 'bad_request') {
      throw error;
    }

    throw new InternalError({ message: 'Erro interno no serviço de CEP' });
  }
}

export default app({ cache: 172800 }).get(getCepWithLocation);
