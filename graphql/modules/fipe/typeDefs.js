import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    """
    Retorna as marcas de fabricantes de determinado tipo de veiculo
    """
    vehicleBrands(
      vehicleType: VEHICLE_TYPE!
      referenceTableCode: Int
    ): [VEHICLE_BRAND]

    vehicleData(code: String!, referenceTableCode: Int): [VEHICLE_DATA]

    fipeReferenceTables: [REFERENCE_TABLE]
  }

  enum VEHICLE_TYPE {
    caminhoes
    carros
    motos
  }

  type REFERENCE_TABLE {
    codigo: Int!
    mes: String!
  }

  type VEHICLE_BRAND {
    nome: String!
    valor: String!
  }

  type VEHICLE_DATA {
    valor: String!
    marca: String!
    modelo: String!
    anoModelo: Int!
    combustivel: String!
    codigoFipe: String!
    mesReferencia: String!
    tipoVeiculo: Int!
    siglaCombustivel: String!
    dataConsulta: String!
  }
`;

export default typeDefs;
