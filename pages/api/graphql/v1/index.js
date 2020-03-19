import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';
import { merge } from 'lodash';
import {
    typeDefs as CEPTypeDefs,
    resolvers as CEPResolvers
} from '../../cep/v1/[cep]';
import {
    typeDefs as StatusTypeDefs,
    resolvers as StatusResolvers
} from '../../status/v1';

import Cors from 'micro-cors';

const cors = Cors({
    allowMethods: ['POST', 'OPTIONS']
});

const RootTypeDefs = gql`
    type Query {
        """
        query vazia como um workaround na escalabilidade de cada endpoint definir seu proprio type e extender a RootQuery
        """
        _empty: String
    }
`;

const resolvers = {
    Query: {}
};

const schema = makeExecutableSchema({
    typeDefs: [RootTypeDefs, CEPTypeDefs, StatusTypeDefs],
    resolvers: merge(resolvers, StatusResolvers, CEPResolvers)
});

const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    context: ({ req, res }) => {
        return { req, res };
    }
});

const handler = apolloServer.createHandler({ path: '/api/graphql/v1' });

export const config = {
    api: {
        bodyParser: false
    }
};

export default cors(handler);
