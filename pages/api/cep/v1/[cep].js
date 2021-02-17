import microCors from 'micro-cors';
import cep from 'cep-promise';

// max-age especifica quanto tempo o browser deve manter o valor em cache, em segundos.
// s-maxage é uma header lida pelo servidor proxy (neste caso, Vercel).
// stale-while-revalidate indica que o conteúdo da cache pode ser servido como 'stale" e revalidado no background
//
// Por que os valores abaixo?
//
// 1. O cache da Vercel é muito rápido e permite respostas em cerca de 10ms. O valor de
//    dois dias (172800 segundos) é suficiente para garantir performance e também que as
//    respostas estejam relativamente sincronizadas caso o governo decida atualizar os CEPs.
// 2. O cache da Vercel é invalidado toda vez que um novo deploy é feito, garantindo que
//    todas as novas requisições sejam servidas pela implementação mais recente da API.
// 3. Não há browser caching pois este tipo de API normalmente é utilizada uma vez só
//    por um usuário. Se fizessemos caching, os valores ficariam lá guardados no browser
//    sem necessidade, só ocupando espaço em disco. A história seria diferente se a API
//    servisse fotos dos usuários, por exemplo. Além disso teríamos problemas com
//    stale/out-of-date cache caso alterássemos a implementação da API.
const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=172800, stale-while-revalidate, public';
const cors = microCors();

const providers = ['correios', 'viacep', 'widenet'];

async function Cep(request, response) {
  const requestedCep = request.query.cep;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const cepResult = await cep(requestedCep, {
      providers,
    });

    response.status(200);
    response.json(cepResult);
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
