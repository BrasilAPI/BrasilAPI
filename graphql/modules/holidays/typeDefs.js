import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    """
    Retorna os feriados no Ano
    Aceita anos apenas acima de 1900
    """
    holidaysOnYear(year: String!): [HolidayResponse]
  }

  """
  HolidayResponse
  """
  type HolidayResponse {
    date: String
    name: String
    type: String
  }
`;

export default typeDefs;
