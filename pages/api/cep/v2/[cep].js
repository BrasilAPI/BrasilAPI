import microCors from 'micro-cors';
import cepPromise from 'cep-promise';
import { getDddsData } from '@/services/ddd';
import fetchGeocoordinateFromBrazilLocation from '../../../../lib/fetchGeocoordinateFromBrazilLocation';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
const providers = ['correios', 'viacep', 'widenet', 'correios-alt'];

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

async function getCepFromCepPromise(requestedCep) {
  return cepPromise(requestedCep, { providers });
}

async function cityDdd(nameCity) {
  try {
    const allDddData = await getDddsData();

    const dddData = allDddData.filter(
      ({ city }) => city === nameCity.toUpperCase()
    );

    return dddData[0].ddd;
  } catch (error) {
    if (error instanceof BaseError) {
      return next(error);
    }

    throw new InternalError({
      message: 'Todos os serviços de DDD retornaram erro.',
      type: 'service_error',
    });
  }
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
    response.json({
      ...cepFromCepPromise,
      ddd: await cityDdd(cepFromCepPromise.city),
      location,
    });
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
