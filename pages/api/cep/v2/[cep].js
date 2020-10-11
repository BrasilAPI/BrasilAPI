import microCors from 'micro-cors';
import cepPromise from 'cep-promise';
import differenceInDays from 'date-fns/differenceInDays';

import { DB_URI } from '../../../../utils/constants';
import connectToDatabase from '../../../../lib/connectToDatabase';
import fetchGeocoordinateFromBrazilLocation from '../../../../lib/fetchGeocoords';

// max-age especifica quanto tempo o browser deve manter o valor em cache, em segundos.
// s-maxage é uma header lida pelo servidor proxy (neste caso, Vercel).
// stale-while-revalidate indica que o conteúdo da cache pode ser servido como "stale" e revalidado no background
//
// Por que os valores abaixo?
//
// 1. O cache da Now é muito rápido e permite respostas em cerca de 10ms. O valor de
//    um dia (86400 segundos) é suficiente para garantir performance e também que as
//    respostas estejam relativamente sincronizadas caso o governo decida atualizar os CEPs.
// 2. O cache da Now é invalidado toda vez que um novo deploy é feito, garantindo que
//    todas as novas requisições sejam servidas pela implementação mais recente da API.
// 3. Não há browser caching pois este tipo de API normalmente é utilizada uma vez só
//    por um usuário. Se fizessemos caching, os valores ficariam lá guardados no browser
//    sem necessidade, só ocupando espaço em disco. A história seria diferente se a API
//    servisse fotos dos usuários, por exemplo. Além disso teríamos problemas com
//    stale/out-of-date cache caso alterássemos a implementação da API.
const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

async function getCollection() {
  const db = await connectToDatabase(DB_URI);
  const collection = await db.collection('ceps');
  return collection;
}

async function getCepFromDatabase(requestedCep) {
  const collection = await getCollection();
  const result = await collection.findOne({ cep: requestedCep });

  if (result) {
    const { createdAt, __v, _id, ...data } = result;
    return data;
  }

  return undefined;
}

async function getCepFromCepPromise(requestedCep) {
  return cepPromise(requestedCep);
}

async function updateOrInsertCepToDatabase(data) {
  const collection = await getCollection();
  await collection.updateOne(
    { cep: data.cep },
    { $set: data },
    { upsert: true }
  );
}

async function Cep(request, response) {
  const requestedCep = request.query.cep;
  const clientIp =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  console.log({
    url: request.url,
    clientIp,
  });

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const cepFromDatabase = await getCepFromDatabase(requestedCep);
    if (
      cepFromDatabase &&
      differenceInDays(new Date(), cepFromDatabase.updatedAt) <= 7
    ) {
      delete cepFromDatabase.updatedAt;

      response.status(200);
      response.json(cepFromDatabase);
      return;
    }

    const cepFromCepPromise = await getCepFromCepPromise(requestedCep);
    const location =
      !cepFromDatabase || !cepFromDatabase.location.coordinates.length === 0
        ? await fetchGeocoordinateFromBrazilLocation(cepFromCepPromise)
        : cepFromDatabase.location;

    await updateOrInsertCepToDatabase({ ...cepFromCepPromise, location });

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
