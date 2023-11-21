import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    """
    Retorna uma lista com os dados da UF selecionada
    """
    ibgeDataByUF(
      """
      UF é a sigla para Unidade da Federação ou Unidade Federativa.
      Unidade da Federação refere-se aos 26 estados brasileiros,
      mais o Distrito Federal, totalizando 27 Unidades Federativas (UF).
      """
      uf: String!
    ): IBGEUF

    getAllUFs: [IBGEUF]
  }

  type IBGERegion {
    id: Int!
    sigla: String!
    nome: String!
  }

  type IBGEUF {
    id: Int!
    sigla: String!
    nome: String!
    regiao: IBGERegion!
  }
`;

export default typeDefs;
