import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    """
    Retorna estado e lista de cidades por DDD
    """
    citiesOfDdd(
      """
      DDD significa Discagem Direta à Distância.
      É um sistema de ligação telefônica automática entre diferentes áreas urbanas nacionais.
      O DDD é um código constituído por 2 dígitos que identificam as principais cidades do país e devem ser adicionados ao nº de telefone, juntamente com o código da operadora.
      """
      ddd: String!
    ): DDDResponse
  }

  """
  DDDResponse
  """
  type DDDResponse {
    state: String
    cities: [String]
  }
`;

export default typeDefs;
