import { gql } from 'apollo-server-micro';

const typeDefs = gql`
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

export default typeDefs;
