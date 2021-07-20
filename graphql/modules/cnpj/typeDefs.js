import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    """
    Retorna os dados do cnpj fornecido
    """
    cnpjData(
      """
      No Brasil, o Cadastro Nacional da Pessoa Jurídica
      é um número único que identifica uma pessoa jurídica
      e outros tipos de arranjo jurídico sem personalidade jurídica
      junto à Receita Federal brasileira.
      """
      cnpj: String!
    ): CNPJDATA
  }

  type QSA {
    cnpj: String
    identificador_de_socio: Int
    nome_socio: String
    cnpj_cpf_do_socio: String
    codigo_qualificacao_socio: Int
    percentual_capital_social: Int
    data_entrada_sociedade: String
    cpf_representante_legal: String
    nome_representante_legal: String
    codigo_qualificacao_representante_legal: Int
  }

  type CNEA_SECUNDARIO {
    codigo: Int
    descricao: String
  }

  type CNPJDATA {
    cnpj: String
    identificador_matriz_filial: Int
    descricao_matriz_filial: String
    razao_social: String
    nome_fantasia: String
    situacao_cadastral: Int
    descricao_situacao_cadastral: String
    data_situacao_cadastral: String
    motivo_situacao_cadastral: String
    nome_cidade_exterior: String
    codigo_natureza_juridica: Int
    data_inicio_atividade: String
    cnae_fiscal: Int
    cnae_fiscal_descricao: String
    descricao_tipo_logradouro: String
    logradouro: String
    numero: String
    complemento: String
    bairro: String
    cep: String
    uf: String
    codigo_municipio: Int
    municipio: String
    ddd_telefone_1: String
    ddd_telefone_2: String
    ddd_fax: String
    qualificacao_do_responsavel: Int
    capital_social: Int
    porte: Int
    descricao_porte: String
    opcao_pelo_simples: Boolean
    data_opcao_pelo_simples: String
    data_exclusao_do_simples: String
    opcao_pelo_mei: Boolean
    situacao_especial: String
    data_situacao_especial: String
    qsa: [QSA]
    cnaes_secundarias: [CNEA_SECUNDARIO]
  }
`;

export default typeDefs;
