import cep from 'cep-promise';
import { NowRequest, NowResponse } from '@vercel/node';
import ReturnError from '../../../../src/library/funError';
import ERRORS from '../../../../src/constants/ERRORS';

// max-age especifica quanto tempo o browser deve manter o valor em cache, em segundos.
// s-maxage é uma header lida pelo servidor proxy (neste caso, Vercel).
// stale-while-revalidate indica que o conteúdo da cache pode ser servido como "stale" e revalidado no background
//
// Por que os valores abaixo? // UPDATE: valores transferidos para vercel.json
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

async function Cep(
  request: NowRequest,
  response: NowResponse
): Promise<NowResponse> {
  const requestedCep = request.query.cep;

  try {
    if (typeof requestedCep !== 'string')
      return response.status(422).json(
        ReturnError({
          message: ERRORS.MESSAGE.CEP.WRONG_TYPE,
          name: ERRORS.NAME.CEP.WRONG_TYPE,
          type: ERRORS.TYPE.CEP.WRONG_TYPE,
        })
      );

    const cepResult = await cep(requestedCep);

    return response.status(200).json(cepResult);
  } catch (error) {
    if (error.name === 'CepPromiseError')
      return response.status(404).json(error);

    return response.status(500).json(error);
  }
}

export default Cep;
