import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    """
    Retorna uma lista com os dados de todos os bancos
    """
    allBanks: [BanksResponse]

    """
    Retorna uma lista com os dados de todos os bancos
    """
    bank(code: Int!): BanksResponse
  }

  """
  BanksResponse
  """
  type BanksResponse {
    ispb: String!
    name: String!
    code: Int
    fullName: String!
  }
`;

export default typeDefs;
