export const ELECTIONS_API_URL =
  'https://divulgacandcontas.tse.jus.br/divulga/rest/v1';

export const CANDIDATE_LIST_URL = '/candidatura/listar';

export const CANDIDATE_SEARCH_URL = '/candidatura/buscar';

export const ELECTIONS_YEARS_URL = '/eleicao/anos-eleitorais';

export const POSITION_LIST_URL = '/eleicao/listar/municipios';

export const ORDINARY_ELECTIONS_URL = '/eleicao/ordinarias';

export const ACCOUNTANT_URL = '/prestador/consulta';

export const verifyIsNotNumber = (value) => {
  if (Number.isNaN(Number(value))) return true;
  return false;
};

export const ERRORMESSAGES = {
  INVALID_PARAMETERS: 'Parâmetros obrigatórios inválidos',
  INVALID_ELECTION: 'Código de eleição inválido',
  INVALID_MUNICIPALITY: 'Código do município inválido',
  INVALID_CANDIDATE: 'Candidato inválido',
  INVALID_POSITION: 'Cargo inválido',
  INVALID_YEAR: 'Ano precisa ter 4 dígitos',
};
