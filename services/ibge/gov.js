import axios from 'axios';
import mapUfToUfCode from '@/util/mapUfToUfCode.js'
import InternalError from '@/errors/InternalError';

const URL_UF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
const URL_AGGREGATES = 'https://servicodados.ibge.gov.br/api/v3/agregados'

const UF_CAPITAIS = {
  AC: 'Rio Branco',
  AL: 'Maceió',
  AP: 'Macapá',
  AM: 'Manaus',
  BA: 'Salvador',
  CE: 'Fortaleza',
  DF: 'Brasília',
  ES: 'Vitória',
  GO: 'Goiânia',
  MA: 'São Luís',
  MT: 'Cuiabá',
  MS: 'Campo Grande',
  MG: 'Belo Horizonte',
  PA: 'Belém',
  PB: 'João Pessoa',
  PR: 'Curitiba',
  PE: 'Recife',
  PI: 'Teresina',
  RJ: 'Rio de Janeiro',
  RN: 'Natal',
  RS: 'Porto Alegre',
  RO: 'Porto Velho',
  RR: 'Boa Vista',
  SC: 'Florianópolis',
  SP: 'São Paulo',
  SE: 'Aracaju',
  TO: 'Palmas',
};

const addCapital = (uf) => ({
  ...uf,
  capital: UF_CAPITAIS[uf.sigla] ?? null,
});

export const getUfs = () =>
  axios.get(URL_UF).then((response) => {
    response.data = response.data.map(addCapital);
    return response;
  });

export const getUfByCode = (code) =>
  axios.get(`${URL_UF}/${code}`).then((response) => {
    response.data = addCapital(response.data);
    return response;
  });

export const getContiesByUf = async (uf) => {
  const { data } = await axios.get(`${URL_UF}/${uf}/municipios`);

  return data.map((item) => ({
    nome: item.nome,
    codigo_ibge: `${item.id}`,
  }));
};

// reference: https://servicodados.ibge.gov.br/api/docs/agregados?versao=3#api-Variaveis-agregadosAgregadoPeriodosPeriodosVariaveisVariavelGet
export const getUfEstimatePopulationByCode = async (uf) => {
  const ufCode = mapUfToUfCode(uf);
  const ESTIMATED_POPULATION_AGGREGATE_ID = 6579;
  const ESTIMATED_POPULATION_VARIABLE_ID = 9324;
  const LATEST_PERIOD = -1;

  let { data } = await axios
    .get(`${URL_AGGREGATES}/${ESTIMATED_POPULATION_AGGREGATE_ID}/periodos/${LATEST_PERIOD}/variaveis?localidades=N3[${ufCode}]`);
  
  data = data.find((item) => item.id == ESTIMATED_POPULATION_VARIABLE_ID);

  if(!data){
    throw new InternalError('Empty data');
  }

  const result = data.resultados[0].series[0].serie;
  const key = Object.keys(result)[0]

  return {
    "populacao_estimada": parseInt(result[key]),
    "periodo": key
  }
}