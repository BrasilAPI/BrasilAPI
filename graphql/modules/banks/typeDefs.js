import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    """
    Consulta lista de bancos e seus dados direto na base de dados do Bacen
    """
    banks: [Bank]!
  }

`;

export default typeDefs;
