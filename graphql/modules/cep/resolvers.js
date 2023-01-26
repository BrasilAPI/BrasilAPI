import { ApolloError } from 'apollo-server-micro';
import cep from 'cep-promise';

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

export default {
  Query: {
    cep: async (_parent, _args, _context) => {
      if (_args.cep.length !== 8) {
        throw new ApolloError('CEP inválido', 'validation_error');
      }

      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
        return await cep(_args.cep);
      } catch (err) {
        throw new ApolloError('Erro ao consultar CEP', err.type, err.errors);
      }
    },
  },
};
