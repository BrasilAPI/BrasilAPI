import cache from '@/graphql/decorators/cache';
import { cacheExpires } from '@/middlewares/constants';
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

const resolvers = merge({ Query: {} }, CEPResolvers, StatusResolvers);
const decorateCache = cache.of(cacheExpires);

Object.entries(resolvers.Query).forEach(([query, handler]) => {
  if (!StatusResolvers.Query[query]) {
    resolvers.Query[query] = decorateCache(handler);
  }
});

export const schema = makeExecutableSchema({
  typeDefs: [RootTypeDefs, CEPTypedefs, StatusTypedefs],
  resolvers,
});
