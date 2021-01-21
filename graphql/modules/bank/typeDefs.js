import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    """
    Consulta dados do banco direto na base de dados do Bacen
    """
    bank(
      """
      CODE deve **sempre** conter 3 caracteres
      [**[referência](https://www.creditooudebito.com.br/codigos-dos-bancos-brasileiros/)**]
      """
      code: Int
      ispb: String
    ): Bank
  }

  """
  Banco
  """
  type Bank {
    ispb: String
    name: String
    code: Int
    fullName: String
  }
`;

export default typeDefs;
