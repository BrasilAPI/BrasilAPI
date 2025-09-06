import axios from 'axios';
import mapUfToUfCode from '@/util/mapUfToUfCode.js'
import InternalError from '@/errors/InternalError';

const URL_UF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
const URL_AGGREGATES = 'https://servicodados.ibge.gov.br/api/v3/agregados'

export const getUfs = () => axios.get(URL_UF);
export const getUfByCode = (code) => axios.get(`${URL_UF}/${code}`);

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
  
  // let data = [{"id":"9324","variavel":"População residente estimada","unidade":"Pessoas","resultados":[{"classificacoes":[],"series":[{"localidade":{"id":"35","nivel":{"id":"N3","nome":"Unidade da Federação"},"nome":"São Paulo"},"serie":{"2025":"46081801"}}]}]}]
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