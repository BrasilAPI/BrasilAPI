import { gql, makeExecutableSchema } from 'apollo-server-micro';
import { merge } from 'lodash';

import CEPModule from './modules/cep';
import DDDModule from './modules/ddd';
import { StatusResolvers, StatusTypedefs } from './modules/status';

const RootTypeDefs = gql`
  type Query {
    """
    query vazia como um workaround na escalabilidade de cada endpoint definir seu proprio type e extender a RootQuery
    """
    _empty: String @deprecated(reason: "")
  }
`;

const resolvers = {
  Query: {},
};

export const schema = makeExecutableSchema({
  typeDefs: [
    RootTypeDefs,
    CEPModule.typedefs,
    DDDModule.typedefs,
    StatusTypedefs,
  ],
  resolvers: merge(
    resolvers,
    CEPModule.resolvers,
    DDDModule.resolvers,
    StatusResolvers
  ),
});
