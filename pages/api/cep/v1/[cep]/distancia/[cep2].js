import microCors from 'micro-cors';
import cepdistance from 'cepdistance-promise';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

async function Distancia(request, response) {
  const { cep: cep1, cep2 } = request.query;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if(cep1 === cep2) {
    response.status(200);
    response.json({ status: 'ok', distance: 0, unity: 'meters' });
    return;
  }

  try {
    const distance = await cepdistance({ cep1, cep2 });

    response.status(200);
    response.json({ status: 'ok', distance, unity: 'meters' });
  } catch (error) {
    if (error.name === 'CepDistanceError') {
      switch (error.type) {
        case 'validation_error':
          response.status(400);
          break;
        case 'fetch_error':
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

export default cors(Distancia);
