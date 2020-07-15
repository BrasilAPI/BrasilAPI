import { gql, makeExecutableSchema } from 'apollo-server-micro';
import { merge } from 'lodash';

import { CEPResolvers, CEPTypedefs } from './modules/cep';
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
  typeDefs: [RootTypeDefs, CEPTypedefs, StatusTypedefs],
  resolvers: merge(resolvers, CEPResolvers, StatusResolvers),
});
