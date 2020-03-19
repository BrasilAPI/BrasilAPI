import { ApolloError, gql } from 'apollo-server-micro';
import microCors from 'micro-cors';
import cep from 'cep-promise';

// max-age especifica quanto tempo o browser deve manter o valor em cache, em segundos.
// s-maxage é uma header lida pelo servidor proxy (neste caso, o Now da ZEIT).
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
const CACHE_CONTROL_HEADER_VALUE = 'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

async function Cep(request, response) {
    const requestedCep = request.query.cep;

    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

    try {
        const cepResult = await cep(requestedCep);

        response.status(200);
        response.json(cepResult);

    } catch (error) {
        if (error.name === 'CepPromiseError') {
            response.status(404);
            response.json(error);
            return;
        }

        response.status(500);
        response.json(error);
    }
}

export const typeDefs = gql`
    extend type Query {
        """
        Retorna o endereço com base no CEP fornecido
        """
        cep(
            """
            CEP deve **sempre** conter 8 caracteres 
            [**[referência](https://pt.wikipedia.org/wiki/C%C3%B3digo_de_Endere%C3%A7amento_Postal)**]
            """
            cep: String!
        ): Address
    }

    """
    Endereço
    """
    type Address {
        cep: String
        state: String
        city: String
        street: String
        neighborhood: String
    }
`;

export const resolvers = {
    Query: {
        cep: async (_parent, _args, _context) => {
            if (_args.cep.length !== 8) {
                throw new ApolloError('CEP inválido', 'validation_error');
            }

            try {
                _context.res.setHeader(
                    'Cache-Control',
                    CACHE_CONTROL_HEADER_VALUE
                );
                const cepResult = await cep(_args.cep);
                return cepResult;
            } catch (err) {
                throw new ApolloError(
                    'Erro ao consultar CEP',
                    err.type,
                    err.errors
                );
            }
        }
    }
};

export default cors(Cep);
