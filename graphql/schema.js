import { gql, makeExecutableSchema } from 'apollo-server-micro';
import { merge } from 'lodash';
import BanksModule from './modules/banks';
import CEPModule from './modules/cep';
import DDDModule from './modules/ddd';
import HolidaysModule from './modules/holidays';
import IbgeModule from './modules/ibge';
import StatusModule from './modules/status';
import CNPJModule from './modules/cnpj';

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
    BanksModule.typedefs,
    CEPModule.typedefs,
    CNPJModule.typedefs,
    DDDModule.typedefs,
    HolidaysModule.typedefs,
    IbgeModule.typedefs,
    StatusModule.typedefs,
  ],
  resolvers: merge(
    resolvers,
    BanksModule.resolvers,
    CEPModule.resolvers,
    CNPJModule.resolvers,
    DDDModule.resolvers,
    HolidaysModule.resolvers,
    IbgeModule.resolvers,
    StatusModule.resolvers
  ),
});
